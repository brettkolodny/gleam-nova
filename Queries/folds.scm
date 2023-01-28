((type_definition
  ("{") @start
  ("}") @end)
  (#set! role type))

((function_parameters
  ("(") @start
  (")") @end)
  (#set! role function))

((function
  ("{") @start
  ("}") @end)
  (#set! role function))

((case
 ("{") @start
 ("}") @end)
 (#set! role block))

((expression_group
 ("{") @start
 ("}") @end)
 (#set! role block)
 (#set! role block))

((unqualified_imports
 ("{") @start
 ("}") @end))

