import prisma from '@/lib/prisma';

/**
 * Menu Database Service
 * Handles all database operations related to food menus and items
 */

/**
 * Get all menu categories for a business
 */
export async function getMenuCategories(businessId: number) {
  return prisma.menu_category.findMany({
    where: {
      BUSINESS_ID: businessId,
      SHOW: 1,
    },
    orderBy: {
      DISPLAY_SEQ: 'asc',
    },
  });
}

/**
 * Create a new menu category
 */
export async function createMenuCategory(data: {
  BUSINESS_ID: number;
  TITLE: string;
  DISPLAY_SEQ?: number;
}) {
  return prisma.menu_category.create({
    data: {
      ...data,
      CREATION_DATETIME: new Date(),
      SHOW: 1,
    },
  });
}

/**
 * Update a menu category
 */
export async function updateMenuCategory(categoryId: number, data: any) {
  return prisma.menu_category.update({
    where: {
      MENU_CATEGORY_ID: categoryId,
    },
    data,
  });
}

/**
 * Delete a menu category (or hide it)
 */
export async function deleteMenuCategory(categoryId: number, permanent: boolean = false) {
  if (permanent) {
    return prisma.menu_category.delete({
      where: {
        MENU_CATEGORY_ID: categoryId,
      },
    });
  } else {
    return prisma.menu_category.update({
      where: {
        MENU_CATEGORY_ID: categoryId,
      },
      data: {
        SHOW: 0,
      },
    });
  }
}

/**
 * Get all food menus for a business
 */
export async function getFoodMenus(businessId: number) {
  return prisma.food_menu.findMany({
    where: {
      BUSINESS_ID: businessId,
      STATUS: 1,
    },
    include: {
      food_menu_items: true,
    },
    orderBy: {
      CREATION_DATETIME: 'desc',
    },
  });
}

/**
 * Get a specific food menu by ID
 */
export async function getFoodMenuById(menuId: number) {
  return prisma.food_menu.findUnique({
    where: {
      FOOD_MENU_ID: menuId,
    },
    include: {
      food_menu_items: {
        orderBy: {
          PRICE: 'asc',
        },
      },
    },
  });
}

/**
 * Create a new food menu
 */
export async function createFoodMenu(data: {
  BUSINESS_ID: number;
  FOOD_CATEGORY_ID?: number;
  TITLE: string;
}) {
  return prisma.food_menu.create({
    data: {
      ...data,
      CREATION_DATETIME: new Date(),
      STATUS: 1,
    },
  });
}

/**
 * Update a food menu
 */
export async function updateFoodMenu(menuId: number, data: any) {
  return prisma.food_menu.update({
    where: {
      FOOD_MENU_ID: menuId,
    },
    data,
  });
}

/**
 * Delete a food menu (change status)
 */
export async function deleteFoodMenu(menuId: number) {
  return prisma.food_menu.update({
    where: {
      FOOD_MENU_ID: menuId,
    },
    data: {
      STATUS: 0,
    },
  });
}

/**
 * Get menu items for a specific category
 */
export async function getMenuItemsByCategory(categoryId: number) {
  return prisma.food_menu_items.findMany({
    where: {
      MENU_CATEGORY_ID: categoryId,
      DISPLAY: 1,
    },
    orderBy: {
      PRICE: 'asc',
    },
  });
}

/**
 * Get a specific menu item by ID
 */
export async function getMenuItemById(itemId: number) {
  return prisma.food_menu_items.findUnique({
    where: {
      FOOD_MENU_ITEMS_ID: itemId,
    },
  });
}

/**
 * Create a new menu item
 */
export async function createMenuItem(data: {
  FOOD_MENU_ID: number;
  MENU_CATEGORY_ID: number;
  TITLE: string;
  DESCRIPTION?: string;
  PRICE: number;
  CURRENCY?: string;
  PIC_1?: string;
  PIC_2?: string;
  PIC_3?: string;
}) {
  return prisma.food_menu_items.create({
    data: {
      ...data,
      CREATION_DATETIME: new Date(),
      APPROVED: 0,
      DISPLAY: 1,
    },
  });
}

/**
 * Update a menu item
 */
export async function updateMenuItem(itemId: number, data: any) {
  return prisma.food_menu_items.update({
    where: {
      FOOD_MENU_ITEMS_ID: itemId,
    },
    data,
  });
}

/**
 * Delete a menu item (or hide it)
 */
export async function deleteMenuItem(itemId: number, permanent: boolean = false) {
  if (permanent) {
    return prisma.food_menu_items.delete({
      where: {
        FOOD_MENU_ITEMS_ID: itemId,
      },
    });
  } else {
    return prisma.food_menu_items.update({
      where: {
        FOOD_MENU_ITEMS_ID: itemId,
      },
      data: {
        DISPLAY: 0,
      },
    });
  }
} 