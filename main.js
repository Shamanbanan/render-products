window.onload = function () {
  window.YaAuthSuggest.init(
    {
      client_id: "b5fea292ec97459ba91e26e84b146f83",
      response_type: "token",
      redirect_uri: "https://examplesite.com/suggest/token"
    },
    "https://examplesite.com",
    {
      view: "button",
      parentId: "container",
      buttonView: "main",
      buttonTheme: "light",
      buttonSize: "m",
      buttonBorderRadius: 0
    }
  )
    .then(function (result) {
      return result.handler();
    })
    .then(function (data) {
      console.log("Сообщение с токеном: ", data);
      document.body.innerHTML += `Сообщение с токеном: ${JSON.stringify(data)}`;
    })
    .catch(function (error) {
      console.log("Что-то пошло не так: ", error);
      document.body.innerHTML += `Что-то пошло не так: ${JSON.stringify(
        error
      )}`;
    });
};
// Замените YOUR_ACCESS_TOKEN на ваш токен доступа
const token = 'YOUR_ACCESS_TOKEN';
const apiUrl = 'https://cloud-api.yandex.net/v1/disk/resources';

fetch(`${apiUrl}/?path=/`, {
  method: 'GET',
  headers: {
    'Authorization': `OAuth ${token}`,
  },
})
  .then(response => response.json())
  .then(data => {
    // Обработка данных о файлов и папок
    console.log(data);
  })
  .catch(error => {
    console.error('Error fetching data from Yandex Disk:', error);
  });
