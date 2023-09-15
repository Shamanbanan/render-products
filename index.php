//токен
//y0_AgAEA7qj-lkeAAp_nQAAAADstiPuO8SuZWGaT8mJjq71SE-zUwyNzuo
//y0_AgAEA7qj-lkeAADLWwAAAADsgiLgkE6kJHAWTUSZvyjSNt0wdlWr_7U
<?php

function vardump($str){
    echo "<pre>";
    var_dump($str);
    echo echo "<pre>";
}

class Backup {
protected $token = 'y0_AgAEA7qj-lkeAAp_nQAAAADstiPuO8SuZWGaT8mJjq71SE-zUwyNzuo'
    /**
 * Method sendQueryYaDisk
 *
 * @param string $urlQuery URL для отправки запросов
 * @param array $arrQuery массив параметров
 * @param string $methodQuery метод отправки
 *
 * @return array
 */
public function sendQueryYaDisk(string $urlQuery, array $arrQuery = [], string $methodQuery = 'GET'): array
{
  if($methodQuery == 'POST') {
      $fullUrlQuery = $urlQuery;
  } else {
      $fullUrlQuery = $urlQuery . '?' . http_build_query($arrQuery);
  }
  $ch = curl_init($fullUrlQuery);
  switch ($methodQuery) {
      case 'PUT':
          curl_setopt($ch, CURLOPT_PUT, true);
          break;
  
      case 'POST':
          curl_setopt($ch, CURLOPT_POST, 1);
          curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($arrQuery));
          break;
  
      case 'DELETE':
          curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
          break;
  }

  curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: OAuth ' . $this-&gt;token]);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_HEADER, false);
  $resultQuery = curl_exec($ch);
  curl_close($ch);
  
  return (!empty($resultQuery)) ? json_decode($resultQuery, true) : [];

}
/**
 * Метод для получения общей информации об аккаунте
 *
 * @return array
 */
public function disk_getInfo(): array
{   
    $urlQuery = 'https://cloud-api.yandex.net/v1/disk/';
    return $this->sendQueryYaDisk($urlQuery);
}
}

$backupClass = new Backup();
$resultQuery = $backupClass->disk_getInfo();
vardump($resultQuery);