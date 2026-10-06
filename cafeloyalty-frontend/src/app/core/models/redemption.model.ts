export interface CreateRedemptionRequest {
    customerId: number;
    rewardId: number;
}

export interface RedemptionResponse {
    redemptionId: number;
    rewardName: string;
    pointsSpent: number;
    remainingPointsBalance: number;
}

export interface Redemption {
    id: number;
    customerId: number;
    customer?: {
        id: number;
        name: string;
        email: string;

    };
    rewardId: number;
    reward?: {
        id: number;
        name: string;
        description: string;
        pointsCost: number;
    };
    date: string;
    pointsSpent: number;
}