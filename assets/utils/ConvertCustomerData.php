<?php
//use 'PHPExcel.php';
define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
require_once dirname(__FILE__) . '/PHPExcel/IOFactory.php';
if(!file_exists("customerTypeData.xlsx")){
	echo "No existe customerTypeData.xlsx.";
}
$objReader = PHPExcel_IOFactory::createReader('Excel2007');
$objReader->setReadDataOnly(true);
$objPHPExcel = $objReader->load("customerTypeData.xlsx");
$dataArray = array();
$worksheet = $objPHPExcel->getActiveSheet();
	$rowiterator = $worksheet->getRowIterator();
	foreach ($rowiterator as $row) {
		if($row->getRowIndex() != 1){
			$cellIterator = $row->getCellIterator();
			$cellIterator->setIterateOnlyExistingCells(true); // Loop all cells, even if it is not set
			$dataArray[$worksheet->getCell('A'.$row->getRowIndex())->getValue()] = array(); 
			foreach ($cellIterator as $column => $cell) {
				if (!is_null($cell) && $column != 0) {
					$currentCustomerType = $worksheet->getCell('A'.$row->getRowIndex())->getValue();
					$currentAttribute = $worksheet->getCellByColumnAndRow($column, 1)->getValue();
					$dataArray[$currentCustomerType][$currentAttribute] = $cell->getCalculatedValue();
				}
			}
		}
		
	}

echo 'Excel convertido exitosamente a json.';
var_dump($dataArray);
$fp = fopen('../config/customerTypeData.json', 'w');
fwrite($fp, json_encode($dataArray));
fclose($fp);
// Echo memory peak usage
?>