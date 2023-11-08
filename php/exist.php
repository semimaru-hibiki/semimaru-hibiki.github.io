<?php
$array = array();
$dir = glob('../com_file/*');
$cnt = count($dir);
if($cnt != 0){
    $array["com_name"] = $dir[0];
    echo json_encode($array);
}
else {
    echo json_encode($array);
}

?>