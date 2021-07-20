//at its simplest, the acces control returns a yes or no value
// depending on the users session

import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria -- yes or no
export const permissions = {
  ...generatedPermissions,
};

// rule based functions
export const rules = {
  // rules can return a boolean or a filter
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    //1. do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    //2. if not do they own this item?
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    //1. do they have the permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    }
    //2. if not do they own this item?
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    //1. do they have the permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    }
    //2. if not do they own this item?
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // they can read everything
    }
    //otherwise only whats available
    return { status: "AVAILABLE" };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    //1. do they have the permission of canManageProducts
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    //2. they may only update themselves
    return { id: session.itemId };
  },
};
