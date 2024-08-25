# Ton FunC Practice


### slice
* `int slice_empty?(slice s)`：检查s中是否既没有数据也没有引用。
* `int slice_data_empty?(slice s)`：检查s中是否没有数据。
* `int slice_refs_empty?(slice s)`：检查s中是否没有引用。
* `() end_parse(cell c)`：检查s是否为空，若为空则抛出异常。

### cell
* `slice begin_parse(cell c)`：将cell转为slice。其中`c`要么是`oridinary cell`要么是`exotic cell`，都会生成一个新的`ordinary cell c'`，将`c'`转为slice。


### dict
* `cell new_dict()`：创建一个空字典。
* `int dict_empty?(cell c)`：判断字典是否为空。
* `cell udict_set(cell dict, int key_len, int   index, slice value)`：添加键值对。
* `cell idict_set(cell dict, int key_len, int   index, slice value)` 
* `cell dict_set (cell dict, int key_len, slice index, slice value)`
* `cell idict_set_ref(cell dict, int key_len, int index, cell value)` 
* `cell udict_set_ref(cell dict, int key_len, int index, cell value)`
* `(slice, int) idict_get?(cell dict, int key_len, int index)`
* `(slice, int) udict_get?(cell dict, int key_len, int index)`


### tuple
* `tuple empty_tuple()`：创建一个空元组。
* `forall X -> tuple tpush(tuple t, X value)`：在末尾添加元素，但最终的tuple不能超过255个字符，否则报错。
* `forall X -> (tuple, ()) ~tpush(tuple t, X value)`
* `forall X -> tuple cons(X head, tuple tail)`：从头添加元素。







