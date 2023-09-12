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
