import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface IngestionProviderConfig {
    oddsApiKey: string;
    opticOddsApiKey: string;
    dailyFantasyApiKey: string;
}
export interface EdgeCalculation {
    edgePercentage: number;
    calcTime: Time;
    propId: bigint;
    edgeScore: string;
    isValid: boolean;
}
export interface PlayerPropsWithEdgesView {
    projections: Array<Projection>;
    verificationResults: Array<VerificationResult>;
    prop: PlayerProps;
    edges: Array<EdgeCalculation>;
}
export interface PlayerProps {
    id: bigint;
    source: string;
    line: number;
    team: string;
    lastUpdated: Time;
    tournament: string;
    sport: Sport;
    lineType: LineType;
    propType: PropType;
    playerName: string;
    lineString: string;
    statCategory: StatCategory;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface VerificationResult {
    verificationTime: Time;
    verificationSummary: string;
    confidenceScore: number;
    propId: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Projection {
    value: number;
    calcTime: Time;
    projectionType: ProjectionType;
    propId: bigint;
    isValid: boolean;
}
export interface UserProfile {
    notificationPreferences: boolean;
    name: string;
    favoriteTeams: Array<string>;
}
export interface CoachRatingD {
    name: string;
    team: string;
    lastUpdated: Time;
    sport: Sport;
    coachID: bigint;
    defensiveRating: number;
    lineupAdjustments: string;
}
export enum LineType {
    prizePicks = "prizePicks",
    sportsBook = "sportsBook"
}
export enum ProjectionType {
    userCustom = "userCustom",
    algoGenerated = "algoGenerated"
}
export enum PropType {
    playerRebounds = "playerRebounds",
    playerPassingYards = "playerPassingYards",
    playerAssists = "playerAssists",
    playerPoints = "playerPoints"
}
export enum Sport {
    mlb = "mlb",
    nba = "nba",
    nfl = "nfl"
}
export enum StatCategory {
    assists = "assists",
    rebounds = "rebounds",
    passingYards = "passingYards",
    points = "points",
    passesCompleted = "passesCompleted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoachRating(coachId: bigint): Promise<CoachRatingD | null>;
    getEdgesSorted(invalidIncluded: boolean): Promise<Array<EdgeCalculation>>;
    getNBAPlayerProps(): Promise<Array<PlayerProps>>;
    getPlayerProp(propId: bigint): Promise<PlayerProps | null>;
    getPlayerPropsWithEdges(propId: bigint): Promise<PlayerPropsWithEdgesView | null>;
    getProjection(propId: bigint): Promise<Projection | null>;
    getProviderConfig(): Promise<IngestionProviderConfig | null>;
    getSource(): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVerificationResult(propId: bigint): Promise<VerificationResult | null>;
    importData(): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveOrUpdateProp(prop: PlayerProps): Promise<void>;
    saveProviderConfig(config: IngestionProviderConfig): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
