function init(){/*Empezamos a registrar datos y los volcamos cada 20 segundos en archivos temporales*/ };

function end(){/*Dejamos de registrar datos y los unimos todos y lo guardamos dentro de un mismo archivo*/};

function send(){/*Enviamos a un servidor los datos almacenados*/};

export {init, end, send}