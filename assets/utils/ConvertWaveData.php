<?php
//use 'PHPExcel.php';
define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
require_once dirname(__FILE__) . '/PHPExcel/IOFactory.php';
if(!file_exists("waveData.xlsx")){
	echo "No existe waveData.xlsx.";
}

$objReader = PHPExcel_IOFactory::createReader('Excel2007');
$objReader->setReadDataOnly(true);
$objPHPExcel = $objReader->load("waveData.xlsx");
$dataArray = array();
foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
	$dataArray[$worksheet->getTitle()] = [];
	$rowiterator = $worksheet->getRowIterator();
	foreach ($rowiterator as $row) {
		if($row->getRowIndex() != 1){
			$cellIterator = $row->getCellIterator();
			$cellIterator->setIterateOnlyExistingCells(true); // Loop all cells, even if it is not set
			$dataArray[$worksheet->getTitle()][$row->getRowIndex()-2] =[]; 
			foreach ($cellIterator as $cell) {
				if (!is_null($cell)) {
						$dataArray[$worksheet->getTitle()][$row->getRowIndex()-2][$worksheet->getCell($cell->getColumn().'1')->getValue()]=$cell->getCalculatedValue();
				}
			}
		}
		
	}
}

echo 'Excel convertido exitosamente a json.';
var_dump($dataArray);
$fp = fopen('../config/waveData.json', 'w');
fwrite($fp, json_encode($dataArray));
fclose($fp);
// Echo memory peak usage
?>