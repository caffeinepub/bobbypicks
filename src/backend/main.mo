import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Float "mo:core/Float";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    favoriteTeams : [Text];
    notificationPreferences : Bool;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can access their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type Sport = {
    #nba;
    #nfl;
    #mlb;
  };

  public type StatCategory = {
    #points;
    #assists;
    #rebounds;
    #passesCompleted;
    #passingYards;
  };

  public type SportCategory = {
    #nba : Text;
    #nfl : Text;
    #mlb : Text;
  };

  public type PropType = {
    #playerPoints;
    #playerAssists;
    #playerRebounds;
    #playerPassingYards;
  };

  module PropType {
    public func getSportCategory(propType : PropType) : SportCategory {
      switch (propType) {
        case (#playerPoints) { #nba("points") };
        case (#playerAssists) { #nba("assists") };
        case (#playerRebounds) { #nba("rebounds") };
        case (#playerPassingYards) { #nfl("passingYards") };
      };
    };
  };

  public type PlayerProps = {
    id : Nat;
    playerName : Text;
    team : Text;
    statCategory : StatCategory;
    propType : PropType;
    source : Text;
    line : Float;
    lineString : Text;
    lineType : LineType;
    lastUpdated : Time.Time;
    sport : Sport;
    tournament : Text;
  };

  public type LineType = {
    #prizePicks;
    #sportsBook;
  };

  module LineType {
    public func compare(a : LineType, b : LineType) : Order.Order {
      Text.compare(debug_show (a), debug_show (b));
    };
  };

  public type EdgeCalculation = {
    edgePercentage : Float;
    edgeScore : Text;
    calcTime : Time.Time;
    propId : Nat;
    isValid : Bool;
  };

  public type Projection = {
    projectionType : ProjectionType;
    value : Float;
    calcTime : Time.Time;
    isValid : Bool;
    propId : Nat;
  };

  public type ProjectionType = {
    #algoGenerated;
    #userCustom;
  };

  public type VerificationResult = {
    confidenceScore : Float;
    verificationSummary : Text;
    verificationTime : Time.Time;
    propId : Nat;
  };

  type PropsMetadata = {
    lastUpdated : Time.Time;
    sport : Sport;
    season : Text;
    source : Text;
  };

  type CoachRating = {
    name : Text;
    coachID : Nat;
    team : Text;
    sport : Sport;
    defensiveRating : Float;
    lineupAdjustments : Text;
    lastUpdated : Time.Time;
  };

  public type Edge = {
    edgeCalculation : EdgeCalculation;
    prop : PlayerProps;
    projection : Projection;
    verificationResult : VerificationResult;
    sportCategory : SportCategory;
  };

  public type PlayerPropsWithEdgesView = {
    prop : PlayerProps;
    projections : [Projection];
    edges : [EdgeCalculation];
    verificationResults : [VerificationResult];
  };

  module PlayerProps {
    public func compare(a : PlayerProps, b : PlayerProps) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module EdgeCalculation {
    public func compare(a : EdgeCalculation, b : EdgeCalculation) : Order.Order {
      Nat.compare(a.propId, b.propId);
    };
  };

  module Projection {
    public func compare(a : Projection, b : Projection) : Order.Order {
      Nat.compare(a.propId, b.propId);
    };
  };

  module VerificationResult {
    public func compare(a : VerificationResult, b : VerificationResult) : Order.Order {
      Nat.compare(a.propId, b.propId);
    };
  };

  let playerProps = Map.empty<Nat, PlayerProps>();
  let edges = Map.empty<Nat, EdgeCalculation>();
  let projections = Map.empty<Nat, Projection>();
  let verificationResults = Map.empty<Nat, VerificationResult>();

  let temporaryId = 0;
  let temporaryEdgeId = 0;
  let temporaryVerificationId = 0;
  let temporaryCalculationId = 0;

  let propsMetadata = Map.empty<LineType, PropsMetadata>();
  let edgeMetadata = Map.empty<Nat, { lastUpdated : Time.Time }>();
  let projectionMetadata = Map.empty<Nat, { lastUpdated : Time.Time }>();
  let verificationMetadata = Map.empty<Nat, { lastUpdated : Time.Time }>();
  let coachRatings = Map.empty<Nat, CoachRating>();

  public type Threshold = {
    sport : Sport;
    value : Float;
    cat : SportCategory;
    pct : Float;
    source : Text;
  };

  let thresholds = List.empty<Threshold>();

  public type IngestionProviderConfig = {
    oddsApiKey : Text;
    dailyFantasyApiKey : Text;
    opticOddsApiKey : Text;
  };

  var providerConfig : ?IngestionProviderConfig = null;

  // Admin-only: Save provider configuration
  public shared ({ caller }) func saveProviderConfig(config : IngestionProviderConfig) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can save provider configurations");
    };
    providerConfig := ?config;
  };

  // Admin-only: Get provider configuration
  public query ({ caller }) func getProviderConfig() : async ?IngestionProviderConfig {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can retrieve provider configurations");
    };
    providerConfig;
  };

  // Admin-only: Data ingestion
  public shared ({ caller }) func importData() : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can import data");
    };
    let url = "https://www.prizepicks.com/projections";
    let category = "points";
    let sport = "nba";
    let result = await OutCall.httpGetRequest(url # "/?category=" # category # "&sport=" # sport, [], transform);
    result;
  };

  // Admin-only: Save or update prop
  public shared ({ caller }) func saveOrUpdateProp(prop : PlayerProps) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can save or update props");
    };

    let natPropId = prop.id;
    switch (playerProps.get(natPropId)) {
      case (null) {
        playerProps.add(natPropId, prop);
        let metadata = {
          lastUpdated = Time.now();
          season = "2023-24";
          sport = prop.sport;
          source = "PrizePicks";
        };
        propsMetadata.add(#prizePicks, metadata);
      };
      case (?existingProp) {
        playerProps.add(natPropId, prop);
        let sourceKey = switch (existingProp.source) {
          case ("PrizePicks") { #prizePicks };
          case (_) { #sportsBook };
        };
        switch (propsMetadata.get(sourceKey)) {
          case (null) {
            let metadata = {
              lastUpdated = Time.now();
              season = "2023-24";
              sport = existingProp.sport;
              source = existingProp.source;
            };
            propsMetadata.add(sourceKey, metadata);
          };
          case (?existingMetadata) {
            propsMetadata.add(sourceKey, {
              lastUpdated = Time.now();
              season = existingMetadata.season;
              sport = existingProp.sport;
              source = existingMetadata.source;
            });
          };
        };
      };
    };
  };

  // Transform function for HTTP outcalls - no user authorization needed (called by IC system)
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    input.response;
  };

  // User-only: Get projection data
  public query ({ caller }) func getProjection(propId : Nat) : async ?Projection {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access projections");
    };
    projections.get(propId);
  };

  // User-only: Get verification result
  public query ({ caller }) func getVerificationResult(propId : Nat) : async ?VerificationResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access verification results");
    };
    verificationResults.get(propId);
  };

  // User-only: Get player prop
  public query ({ caller }) func getPlayerProp(propId : Nat) : async ?PlayerProps {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access player props");
    };
    playerProps.get(propId);
  };

  // User-only: Get sorted edges
  public query ({ caller }) func getEdgesSorted(invalidIncluded : Bool) : async [EdgeCalculation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access edges");
    };
    let iter = edges.values();
    let filteredIter = iter.filter(func(edge) { if (invalidIncluded) { true } else { edge.isValid } });
    let filteredEdges = filteredIter.toArray().sort();
    filteredEdges;
  };

  // User-only: Get NBA player props
  public query ({ caller }) func getNBAPlayerProps() : async [PlayerProps] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access NBA player props");
    };
    let iter = playerProps.values();
    let filteredIter = iter.filter(func(prop) { prop.sport == #nba });
    filteredIter.toArray();
  };

  // User-only: Get player props with edges
  public query ({ caller }) func getPlayerPropsWithEdges(propId : Nat) : async ?PlayerPropsWithEdgesView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access player props with edges");
    };
    switch (playerProps.get(propId)) {
      case (null) { null };
      case (?prop) {
        let propEdges = edges.values().toArray().filter(func(edge) { edge.propId == propId });
        let propProjections = projections.values().toArray().filter(func(proj) { proj.propId == propId });
        let propVerifications = verificationResults.values().toArray().filter(func(verification) { verification.propId == propId });

        ?{
          prop;
          projections = propProjections;
          edges = propEdges;
          verificationResults = propVerifications;
        };
      };
    };
  };

  type CoachRatingD = {
    name : Text;
    coachID : Nat;
    team : Text;
    sport : Sport;
    defensiveRating : Float;
    lineupAdjustments : Text;
    lastUpdated : Time.Time;
  };

  // User-only: Get coach rating
  public query ({ caller }) func getCoachRating(coachId : Nat) : async ?CoachRatingD {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access coach ratings");
    };
    switch (coachRatings.get(coachId)) {
      case (null) { null };
      case (?coachRating) {
        ?{
          name = coachRating.name;
          coachID = coachRating.coachID;
          team = coachRating.team;
          sport = coachRating.sport;
          defensiveRating = coachRating.defensiveRating;
          lineupAdjustments = coachRating.lineupAdjustments;
          lastUpdated = coachRating.lastUpdated;
        };
      };
    };
  };

  // User-only: Get source
  public query ({ caller }) func getSource() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access source information");
    };
    switch (playerProps.get(0)) {
      case (null) { "notFound" };
      case (?playerProp) { playerProp.source };
    };
  };
};
