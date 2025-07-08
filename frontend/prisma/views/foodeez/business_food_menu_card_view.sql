SELECT
  `x`.`BUSINESS_ID` AS `BUSINESS_ID`,
  `x`.`BUSINESS_NAME` AS `BUSINESS_NAME`,
  `y`.`BUSINESS_FOOD_MENU_CARD_ID` AS `BUSINESS_FOOD_MENU_CARD_ID`,
  `y`.`TITLE` AS `MENU_NAME`
FROM
  (
    `foodeez`.`business` `x`
    JOIN `foodeez`.`business_food_menu_card` `y` ON(
      (
        (`x`.`BUSINESS_ID` = `y`.`BUSINESS_ID`)
        AND (`y`.`VALID_FROM` <= NOW())
        AND (IFNULL(`y`.`VALID_TO`, NOW()) >= NOW())
      )
    )
  )
ORDER BY
  `y`.`BUSINESS_FOOD_MENU_CARD_ID`