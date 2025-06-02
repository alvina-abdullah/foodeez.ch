SELECT
  `a`.`CNT` AS `CNT`,
  `a`.`BUSINESS_CATEGORY_ID` AS `BUSINESS_CATEGORY_ID`,
  `a`.`CATEGORY_NAME` AS `CATEGORY_NAME`
FROM
  (
    SELECT
      count(1) AS `CNT`,
      `foodeez`.`business_2_business_category_view`.`BUSINESS_CATEGORY_ID` AS `BUSINESS_CATEGORY_ID`,
      `foodeez`.`business_2_business_category_view`.`CATEGORY_NAME` AS `CATEGORY_NAME`
    FROM
      `foodeez`.`business_2_business_category_view`
    GROUP BY
      `foodeez`.`business_2_business_category_view`.`BUSINESS_CATEGORY_ID`,
      `foodeez`.`business_2_business_category_view`.`CATEGORY_NAME`
  ) `a`
WHERE
  (`a`.`CNT` > 20)
ORDER BY
  `a`.`CNT` DESC