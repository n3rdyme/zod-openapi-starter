export interface UserToken {
  readonly id: string;
  readonly username: string;
  readonly timestamp: number;
  readonly roles: readonly string[];
}
