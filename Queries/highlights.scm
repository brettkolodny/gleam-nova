; Comments
(module_comment) @comment
(statement_comment) @comment
(comment) @comment

; Constants
(constant
  name: (identifier) @constant)

; Modules
(module) @module
(import alias: (identifier) @module)
(remote_type_identifier
  module: (identifier) @module)
(remote_constructor_name
  module: (identifier) @module)
((field_access
  record: (identifier) @module
  field: (label) @function)
 (#is-not? local))

; Functions
(unqualified_import (identifier) @function)
(function
  name: (identifier) @identifier.function)
(external_function
  name: (identifier) @identifier.function)
(function_parameter
  name: (identifier) @identifier.argument)
((function_call
   function: (identifier) @identifier.function)
 (#is-not? local))
((binary_expression
   operator: "|>"
   right: (identifier) @identifier.function)
 (#is-not? local))

; "Properties"
; Assumed to be intended to refer to a name for a field; something that comes
; before ":" or after "."
; e.g. record field names, tuple indices, names for named arguments, etc
(label) @identifier.property
(tuple_access
  index: (integer) @property)

; Type names
(remote_type_identifier) @type
(type_identifier) @identifier.type

; Data constructors
(constructor_name) @identifier.type

; Literals
(string) @string
(bit_string_segment_option) @function.builtin
(integer) @value.number
(float) @value.number

; Variables
(identifier) @variable
(discard) @comment.unused

; Operators
(binary_expression
  operator: _ @operator)
"!" @operator

; Keywords
[
  (opacity_modifier) ; "opaque"
  "as"
  "assert"
  "case"
  "const"
  "external"
  "fn"
  "if"
  "import"
  "let"
  "todo"
  "try"
  "type"
  "use"
] @keyword

[
  (visibility_modifier) ; pub
  (opacity_modifier) ; opaque
] @keyword.modifier

; Punctuation
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
  "<<"
  ">>"
] @punctuation.bracket
[
  "."
  ","
  ;; Controversial -- maybe some are operators?
  ":"
  "#"
  "="
  "->"
  ".."
  "-"
  "<-"
] @punctuation.delimiter
