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
export interface SensitivitySettings {
    marketAlertsEnabled: boolean;
    edgeThresholdPercentage: bigint;
    verificationRollingWindow: VerificationRollingWindow;
}
export interface SettlementMetrics {
    totalLost: bigint;
    totalPush: bigint;
    totalROI: number;
    totalWon: bigint;
    totalSettled: bigint;
    sevenDayWinRate: number;
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
export interface LivePick {
    id: bigint;
    source: string;
    line: number;
    gameStatus: GameStatus;
    team: string;
    lastUpdated: Time;
    tournament: string;
    sport: Sport;
    lineType: LineType;
    propType: PropType;
    awayMoneylineOdds?: number;
    playerName: string;
    homeMoneylineOdds?: number;
    lineString: string;
    statCategory: StatCategory;
}
export interface SettleablePrediction {
    id: bigint;
    source: string;
    betAmount?: number;
    line: number;
    gameStatus: GameStatus;
    odds?: number;
    team: string;
    lastUpdated: Time;
    tournament: string;
    settlementStatus: SettlementStatus;
    sport: Sport;
    lineType: LineType;
    propType: PropType;
    playerName: string;
    resultValue?: number;
    outcome?: SettlementOutcome;
    lineString: string;
    statCategory: StatCategory;
}
export interface SettlementDiagnostics {
    totalSettledPredictions: bigint;
    lastFailureMessage: string;
    totalFailedSettlements: bigint;
    totalSettlementAttempts: bigint;
    lastSuccess: Time;
    numSettledInLastRun: bigint;
    totalPendingPredictions: bigint;
    lastFailure: Time;
    lastAttempt: Time;
    totalSuccessfulSettlements: bigint;
}
export interface PlayerPropsWithEdgesView {
    projections: Array<Projection>;
    verificationResults: Array<VerificationResult>;
    prop: PlayerProps;
    edges: Array<EdgeCalculation>;
}
export interface EdgeCalculation {
    edgePercentage: number;
    calcTime: Time;
    propId: bigint;
    edgeScore: string;
    isValid: boolean;
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
export interface OpticOddsConnectionResult {
    healthy: boolean;
    message: string;
    timestamp: Time;
    statusCode?: bigint;
    responseBody?: string;
}
export interface VerificationResult {
    verificationTime: Time;
    verificationSummary: string;
    confidenceScore: number;
    propId: bigint;
}
export interface LivePicksDiagnostics {
    lastFailureMessage: string;
    totalFailures: bigint;
    lastSuccess: Time;
    totalAttempts: bigint;
    lastFailure: Time;
    totalSuccesses: bigint;
    lastAttempt: Time;
    numLivePicks: bigint;
}
export interface UserProfile {
    notificationPreferences: boolean;
    name: string;
    sensitivitySettings: SensitivitySettings;
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
export enum GameStatus {
    notStarted = "notStarted",
    completed = "completed",
    inProgress = "inProgress"
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
export enum SettlementOutcome {
    won = "won",
    lost = "lost",
    push = "push"
}
export enum SettlementStatus {
    active = "active",
    settled = "settled"
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
export enum VerificationRollingWindow {
    last3Games = "last3Games",
    seasonAverage = "seasonAverage"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getActivePredictionsCount(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoachRating(coachId: bigint): Promise<CoachRatingD | null>;
    getEdgesSorted(invalidIncluded: boolean): Promise<Array<EdgeCalculation>>;
    getLivePicks(): Promise<Array<LivePick>>;
    getLivePicksDiagnostics(): Promise<LivePicksDiagnostics>;
    getLivePicksLastUpdated(): Promise<Time>;
    getNBAPlayerProps(): Promise<Array<PlayerProps>>;
    getPlayerProp(propId: bigint): Promise<PlayerProps | null>;
    getPlayerPropsWithEdges(propId: bigint): Promise<PlayerPropsWithEdgesView | null>;
    getProjection(propId: bigint): Promise<Projection | null>;
    getProviderConfig(): Promise<IngestionProviderConfig | null>;
    getSettleablePrediction(predictionId: bigint): Promise<SettleablePrediction | null>;
    getSettlementDiagnostics(): Promise<SettlementDiagnostics>;
    getSettlementMetrics(): Promise<SettlementMetrics>;
    getSource(): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSensitivitySettings(): Promise<SensitivitySettings | null>;
    getVerificationResult(propId: bigint): Promise<VerificationResult | null>;
    importData(): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    refreshLivePicksInternal(): Promise<void>;
    register(): Promise<void>;
    runSettlementNow(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveOrUpdateProp(prop: PlayerProps): Promise<void>;
    saveProviderConfig(config: IngestionProviderConfig): Promise<void>;
    testOpticOddsConnection(): Promise<OpticOddsConnectionResult>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateSensitivitySettings(newSettings: SensitivitySettings): Promise<void>;
}
