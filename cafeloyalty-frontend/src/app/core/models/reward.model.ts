export interface Reward {
  id: number;
  name: string;
  description: string | null;
  pointsCost: number;
  isActive: boolean;
}

export interface CreateRewardRequest {
  name: string;
  description: string;
  pointsCost: number;
}