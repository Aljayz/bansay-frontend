import { defineStore } from 'pinia';
import { BansayService } from 'src/services/bansay-service';
import {
  type User,
  type UserControllerGetUsersRoleEnum,
  type UserControllerGetUsersStatusEnum,
} from 'src/services/sdk';

export interface UserState {
  users: User[];
  pendingCount: number;
  loading: boolean;
}

export const useUserStore = defineStore('users', {
  state: (): UserState => ({
    users: [],
    pendingCount: 0,
    loading: false,
  }),

  actions: {
    async fetchUsers(
      status?: UserControllerGetUsersStatusEnum,
      role?: UserControllerGetUsersRoleEnum,
    ) {
      this.loading = true;
      try {
        this.users = await BansayService.getInstance().getAllUsers(status, role);
      } finally {
        this.loading = false;
      }
    },

    async fetchPendingCount() {
      try {
        this.pendingCount = await BansayService.getInstance().getPendingRegistrationCount();
      } catch (error) {
        console.error('Failed to fetch pending count:', error);
      }
    }
  },
});
