<?php
$array = array();

$array["com_name"] = $_POST['name'];
//$array["num"] = $_POST['number'];

$dir = glob('../com_file/*');
 
foreach ($dir as $file){
  //ファイルを削除する
  if (unlink($file)){
    echo $file.'の削除に成功しました。<br>';
  }else{
    echo $file.'の削除に失敗しました。<br>';
  }
}  
// ファイルの存在確認
if( !file_exists($array["com_name"]) ){
    // ファイル作成
    touch( $array["com_name"] );
  }else{
    // すでにファイルが存在する為エラーとする
    echo('Warning - ファイルが存在しています。 file name:['.$array["com_name"].']');
    exit();
  }

  // ファイルのパーティションの変更
  chmod( $array["com_name"], 0666 );
  echo('Info - ファイル作成完了。 file name:['.$array["com_name"].']');

  echo json_encode($array);
?>