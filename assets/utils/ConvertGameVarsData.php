<?php
//use 'PHPExcel.php';
define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
require_once dirname(__FILE__) . '/PHPExcel/IOFactory.php';
if(!file_exists("gameVarsData.xlsx")){
	echo "No existe gameVarsData.xlsx.";
}
$objReader = PHPExcel_IOFactory::createReader('Excel2007');
//$objReader->setReadDataOnly(true);
$objPHPExcel = $objReader->load("gameVarsData.xlsx");

$dataArray = array();

$constantsArray = array();
$worksheet = $objPHPExcel->getSheet(0);
	$rowiterator = $worksheet->getRowIterator();
	foreach ($rowiterator as $row) {
		if($row->getRowIndex() != 1){
			$constantsArray[$worksheet->getCell('A'.$row->getRowIndex())->getValue()]
			 =$worksheet->getCell('C'.$row->getRowIndex())->getValue();
		}
		
	}

$dataArray["constantData"] = $constantsArray;

$buildingsArray = array();
$worksheet = $objPHPExcel->getSheet(1);
	$rowiterator = $worksheet->getRowIterator();
	foreach ($rowiterator as $row) {
		if($row->getRowIndex() != 1){
			$cellIterator = $row->getCellIterator();
			$cellIterator->setIterateOnlyExistingCells(true); // Loop all cells, even if it is not set
			$buildingsArray[$worksheet->getCell('A'.$row->getRowIndex())->getValue()] = array(); 
			foreach ($cellIterator as $column => $cell) {
				if (!is_null($cell) && $column != 0) {
					$buildingType = $worksheet->getCell('A'.$row->getRowIndex())->getValue();
					$currentAttribute = $worksheet->getCellByColumnAndRow($column, 1)->getValue();
					$buildingsArray[$buildingType][$currentAttribute] = $cell->getCalculatedValue();
				}
			}
		}
		
	}

$dataArray["buildingData"] = $buildingsArray;

$standsArray = array();
$worksheet = $objPHPExcel->getSheet(2);
	$rowiterator = $worksheet->getRowIterator();
	foreach ($rowiterator as $row) {
		if($row->getRowIndex() != 1){
			$cellIterator = $row->getCellIterator();
			$cellIterator->setIterateOnlyExistingCells(true); // Loop all cells, even if it is not set
			$standsArray[$worksheet->getCell('A'.$row->getRowIndex())->getValue()] = array(); 
			foreach ($cellIterator as $column => $cell) {
				if (!is_null($cell) && $column != 0) {
					$standType = $worksheet->getCell('A'.$row->getRowIndex())->getValue();
					$currentAttribute = $worksheet->getCellByColumnAndRow($column, 1)->getValue();
					$standsArray[$standType][$currentAttribute] = $cell->getCalculatedValue();
				}
			}
		}
		
	}

$dataArray["standData"] = $standsArray;

//print_r(array_values($dataArray));

//echo json_encode($dataArray);

echo 'Excel convertido exitosamente a json.';
var_dump($dataArray);
$fp = fopen('../config/gameVarsData.json', 'w');
fwrite($fp, json_encode($dataArray));
fclose($fp);

// Echo memory peak usage
?>