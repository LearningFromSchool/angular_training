<?php 

$action = $_REQUEST['action'];
$method = $_SERVER['REQUEST_METHOD'];

switch($action){
    case 'upload':
        if($method == 'POST')
        {
            uploadFile();
        }
    case 'list_files':
        if($method == 'GET')
        {
            listFiles();
        }
    case 'delete_file':
        if($method == 'POST')
        {
            deleteFile();
        }
    break;

    default:
        echo 'Action not found';
        break;
}


function uploadFile(){

    $contador = 1;


        if(isset($_FILES['file'])){

            for($i = 0; $i < count($_FILES['file']['name']);$i++){
                $file_name = $_FILES['file']['name'][$i];
                $file_size = $_FILES['file']['size'][$i];
                $file_error = $_FILES['file']['error'][$i];
                $file_ext = explode('.', $file_name);
                $file_ext = strtolower(end($file_ext));
                $allowed = array('jpg', 'jpeg', 'png', 'doc', 'docx', 'pdf', 'txt', 'xls', 'xlsx', 'ppt', 'pptx');
                    
                if(in_array($file_ext, $allowed)){
                    if($file_error === 0){
                        if($file_size <= 2097152){

                            while(count(glob("uploads/NINJA_" . $contador . ".*")) > 0) {
                                $contador++;

                            }

                            $file_name_new = 'NINJA_' . $contador . '.' . $file_ext;

                            $file_destination = 'uploads/' . $file_name_new;

                            if(move_uploaded_file($_FILES['file']['tmp_name'][$i], $file_destination)){
                                echo 'File uploaded successfully';
                            }else{
                                echo 'File not uploaded';
                            }
                        }
                    }
                }
            }
        }

}

function listFiles(){
    //$files = scandir('uploads');
    // GET ALL FILES IN DIRECTORY STARTING WITH NINJA_
    $files = glob("uploads/NINJA_*.*");
    $files = array_diff($files, array('.', '..'));
    
    $nameFiles = array();

    foreach($files as $file){
        $file = basename($file);
        $src = 'uploads/' . $file;
        // check if file is image
        
        $image_extensions = array('jpg', 'jpeg', 'png');

        if(in_array(pathinfo($src, PATHINFO_EXTENSION), $image_extensions)){
            //$nameFiles[] = array('isImage' => true);
            $nameFiles[] = array('name' => $file, 'src' => $src, 'isImage' => true);
        }else{
            $extensionFile = pathinfo($src, PATHINFO_EXTENSION);

            if($extensionFile == 'doc' || $extensionFile == 'docx'){
                $srcImage = 'uploads/word.jpg';
            }else if($extensionFile == 'pdf'){
                $srcImage = 'uploads/pdf.png';
            }else if($extensionFile == 'txt'){
                //$srcImage = 'uploads/txt.png';
            }else if($extensionFile == 'xls' || $extensionFile == 'xlsx'){
                $srcImage = 'uploads/excel.jpg';
            }else if($extensionFile == 'ppt' || $extensionFile == 'pptx'){
                $srcImage = 'uploads/ppt.png';
            }

            $nameFiles[] = array('name' => $file, 'src' => $src, 'isImage' => false, 'srcImage' => $srcImage);
        }
    }

    
    // echo json array 
    //echo json_encode($nameFiles);
    // json encode with key and value
    echo json_encode(array('files' => $nameFiles));

}

function deleteFile(){
    echo 'delete file';

    $file = $_GET['file_name'];

    $msg = '';

    // check if file exists
    if(!file_exists('uploads/' . $file)){
        $msg = 'File does not exist';
    }else{
        if(unlink('uploads/' . $file)){
            $msg = 'File deleted successfully';
        }else{
            $msg = 'File not deleted';
        }
    }

    echo json_encode(array('msg' => $msg));

    
}

?>