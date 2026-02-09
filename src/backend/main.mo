import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import List "mo:core/List";
import Bool "mo:core/Bool";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import OutCall "http-outcalls/outcall";


import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Add migration to actor definition

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type VerificationRollingWindow = {
    #last3Games;
    #seasonAverage;
  };

  public type SensitivitySettings = {
    edgeThresholdPercentage : Nat; // 1-10%
    verificationRollingWindow : VerificationRollingWindow;
    marketAlertsEnabled : Bool;
  };

  public type UserProfile = {
    name : Text;
    favoriteTeams : [Text];
    notificationPreferences : Bool;
    sensitivitySettings : SensitivitySettings;
  };

  public type OpticOddsConnectionResult = {
    healthy : Bool;
    message : Text;
    statusCode : ?Nat;
    responseBody : ?Text;
    timestamp : Time.Time;
  };

  public type LivePicksDiagnostics = {
    lastAttempt : Time.Time;
    lastSuccess : Time.Time;
    lastFailure : Time.Time;
    lastFailureMessage : Text;
    numLivePicks : Nat;
    totalAttempts : Nat;
    totalSuccesses : Nat;
    totalFailures : Nat;
  };

  public type SettlementOutcome = {
    #won;
    #lost;
    #push;
  };

  public type GameStatus = {
    #inProgress;
    #completed;
    #notStarted;
  };

  public type SettleablePrediction = {
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
    gameStatus : GameStatus;
    settlementStatus : SettlementStatus;
    outcome : ?SettlementOutcome;
    resultValue : ?Float;
    odds : ?Float;
    betAmount : ?Float;
  };

  public type SettlementStatus = {
    #active;
    #settled;
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

  public type LivePick = {
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
    gameStatus : GameStatus;
    homeMoneylineOdds : ?Float;
    awayMoneylineOdds : ?Float;
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
  let livePicks = Map.empty<Nat, LivePick>();
  let settleablePredictions = Map.empty<Nat, SettleablePrediction>();

  var livePicksLastUpdated : Time.Time = 0;

  let temporaryId = 0;
  let temporaryEdgeId = 0;
  let temporaryVerificationId = 0;
  let temporaryCalculationId = 0;
  let temporaryPredictionId = 0;

  let propsMetadata = Map.empty<LineType, PropsMetadata>();
  let edgeMetadata = Map.empty<Nat, { lastUpdated : Time.Time }>();
  let projectionMetadata = Map.empty<Nat, { lastUpdated : Time.Time }>();
  let verificationMetadata = Map.empty<Nat, { lastUpdated : Time.Time }>();
  let coachRatings = Map.empty<Nat, CoachRating>();
  let userProfiles = Map.empty<Principal, UserProfile>();

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

  public shared ({ caller }) func saveProviderConfig(config : IngestionProviderConfig) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only admins can save provider configurations");
    };
    providerConfig := ?config;
  };

  public query ({ caller }) func getProviderConfig() : async ?IngestionProviderConfig {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only admins can retrieve provider configurations");
    };
    providerConfig;
  };

  public shared ({ caller }) func testOpticOddsConnection() : async OpticOddsConnectionResult {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only admins can test OpticOdds connection");
    };

    switch (providerConfig) {
      case (null) {
        {
          healthy = false;
          message = "Provider configuration not found";
          statusCode = null;
          responseBody = null;
          timestamp = Time.now();
        };
      };
      case (?config) {
        let url = "https://api.opticodds.com/system/healthcheck";
        let headers = [
          {
            name = "Authorization";
            value = "Bearer " # config.opticOddsApiKey;
          },
          {
            name = "Content-Type";
            value = "application/json";
          },
        ];

        let startTime = Time.now();

        let responseBody = await OutCall.httpGetRequest(url, headers, transform);
        let elapsed = Time.now() - startTime;
        {
          healthy = true;
          message = "OpticOdds API connection successful (" # elapsed.toText() # " ms)";
          statusCode = ?200;
          responseBody = ?responseBody;
          timestamp = Time.now();
        };
      };
    };
  };

  public shared ({ caller }) func importData() : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only admins can import data");
    };
    let url = "https://www.prizepicks.com/projections";
    let category = "points";
    let sport = "nba";
    let result = await OutCall.httpGetRequest(url # "/?category=" # category # "&sport=" # sport, [], transform);
    result;
  };

  public shared ({ caller }) func saveOrUpdateProp(prop : PlayerProps) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only admins can save or update props");
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

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    input.response;
  };

  public query ({ caller }) func getProjection(propId : Nat) : async ?Projection {
    projections.get(propId);
  };

  public query ({ caller }) func getVerificationResult(propId : Nat) : async ?VerificationResult {
    verificationResults.get(propId);
  };

  public query ({ caller }) func getPlayerProp(propId : Nat) : async ?PlayerProps {
    playerProps.get(propId);
  };

  public query ({ caller }) func getEdgesSorted(invalidIncluded : Bool) : async [EdgeCalculation] {
    let iter = edges.values();
    let filteredIter = iter.filter(func(edge) { if (invalidIncluded) { true } else { edge.isValid } });
    filteredIter.toArray();
  };

  public query ({ caller }) func getNBAPlayerProps() : async [PlayerProps] {
    let iter = playerProps.values();
    let filteredIter = iter.filter(func(prop) { prop.sport == #nba });
    filteredIter.toArray();
  };

  public query ({ caller }) func getPlayerPropsWithEdges(propId : Nat) : async ?PlayerPropsWithEdgesView {
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

  public query ({ caller }) func getCoachRating(coachId : Nat) : async ?CoachRatingD {
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

  public query ({ caller }) func getSource() : async Text {
    switch (playerProps.get(0)) {
      case (null) { "notFound" };
      case (?playerProp) { playerProp.source };
    };
  };

  var livePicksDiagnostics : LivePicksDiagnostics = {
    lastAttempt = 0;
    lastSuccess = 0;
    lastFailure = 0;
    lastFailureMessage = "";
    numLivePicks = 0;
    totalAttempts = 0;
    totalSuccesses = 0;
    totalFailures = 0;
  };

  public shared ({ caller }) func refreshLivePicksInternal() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can refresh live picks");
    };

    livePicksDiagnostics := {
      lastAttempt = Time.now();
      lastSuccess = livePicksDiagnostics.lastSuccess;
      lastFailure = livePicksDiagnostics.lastFailure;
      lastFailureMessage = livePicksDiagnostics.lastFailureMessage;
      numLivePicks = livePicksDiagnostics.numLivePicks;
      totalAttempts = livePicksDiagnostics.totalAttempts + 1;
      totalSuccesses = livePicksDiagnostics.totalSuccesses;
      totalFailures = livePicksDiagnostics.totalFailures;
    };

    let initialLivePicks : [LivePick] = [
      {
        id = 1;
        playerName = "LeBron James";
        team = "Lakers";
        statCategory = #points;
        propType = #playerPoints;
        source = "PrizePicks";
        line = 27.8;
        lineString = "27.5";
        lineType = #prizePicks;
        lastUpdated = Time.now();
        sport = #nba;
        tournament = "Regular Season";
        gameStatus = #inProgress;
        homeMoneylineOdds = ?-150;
        awayMoneylineOdds = ?+130;
      },
      {
        id = 2;
        playerName = "Patrick Mahomes";
        team = "Chiefs";
        statCategory = #passingYards;
        propType = #playerPassingYards;
        source = "PrizePicks";
        line = 302.5;
        lineString = "302.5";
        lineType = #prizePicks;
        lastUpdated = Time.now();
        sport = #nfl;
        tournament = "Week 7";
        gameStatus = #notStarted;
        homeMoneylineOdds = null;
        awayMoneylineOdds = null;
      },
    ];

    livePicks.clear();
    for (pick in initialLivePicks.values()) {
      livePicks.add(pick.id, pick);
    };
    livePicksLastUpdated := Time.now();

    livePicksDiagnostics := {
      lastAttempt = Time.now();
      lastSuccess = Time.now();
      lastFailure = livePicksDiagnostics.lastFailure;
      lastFailureMessage = livePicksDiagnostics.lastFailureMessage;
      numLivePicks = initialLivePicks.size();
      totalAttempts = livePicksDiagnostics.totalAttempts;
      totalSuccesses = livePicksDiagnostics.totalSuccesses + 1;
      totalFailures = livePicksDiagnostics.totalFailures;
    };
  };

  public query ({ caller }) func getLivePicks() : async [LivePick] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access live picks");
    };
    livePicks.values().toArray();
  };

  public query ({ caller }) func getLivePicksLastUpdated() : async Time.Time {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access live picks data");
    };
    livePicksLastUpdated;
  };

  public query ({ caller }) func getLivePicksDiagnostics() : async LivePicksDiagnostics {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access live picks diagnostics");
    };
    livePicksDiagnostics;
  };

  public shared ({ caller }) func updateSensitivitySettings(newSettings : SensitivitySettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update sensitivity settings");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User profile not found");
      };
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          existingProfile with
          sensitivitySettings = newSettings
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getUserSensitivitySettings() : async ?SensitivitySettings {
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { ?profile.sensitivitySettings };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getSettleablePrediction(predictionId : Nat) : async ?SettleablePrediction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access predictions");
    };
    switch (settleablePredictions.get(predictionId)) {
      case (null) { null };
      case (?prediction) {
        ?prediction;
      };
    };
  };

  public query ({ caller }) func getActivePredictionsCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access prediction counts");
    };
    var count = 0;
    for (prediction in settleablePredictions.values()) {
      if (prediction.settlementStatus == #active) {
        count += 1;
      };
    };
    count;
  };

  public shared ({ caller }) func register() : async () {
    let adminToken : Text = "";
    let userProvidedToken : Text = "";
    AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
  };
};
