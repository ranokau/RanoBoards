document.addEventListener('DOMContentLoaded', function () {

    let myChart;
    let selectedDataSets = {
        temperatura: true,
        humedad: true,
        co2: true,
        vpd: true,
        o2: true,
        ph: true,
        ec: true,
        temp:true,
    };

    inicializarGraficos();
    setInterval(obtenerYActualizarDatos, 5000); // Actualiza cada 5 segundos

    async function obtenerYActualizarDatos() {
        try {
            const respuesta = await fetch('/api/sensor/ultimos-datos');
            const nuevosDatos = await respuesta.json();
            //actualizarGraficoConNuevosDatos(nuevosDatos);
            actualizarValoresActuales(nuevosDatos);
            // Suponiendo que 'nuevoDato' es el último dato recibido desde tu backend o fuente de datos
        } catch (error) {
            console.error('Error al obtener los nuevos datos:', error);
        }
    }
    async function inicializarGraficos() {
            try {
                const respuesta = await fetch('/api/sensor/ultimos-datos');
                const nuevosDatos = await respuesta.json();
                
                // Asumiendo que tienes datos similares para la nutrición y el clima
                inicializarGraficoClima(nuevosDatos, 'climaChart');
                inicializarGraficoNutricion(nuevosDatos, 'nutricionChart'); // Implementa esta función similar a inicializarGrafico
            } catch (error) {
                console.error('Error al obtener los nuevos datos:', error);
            }
        }
    // Esta función inicializa el gráfico de nutrición con datos iniciales
    function inicializarGraficoNutricion(datosIniciales, idCanvas) {
            const labels = datosIniciales.map(dato => new Date(dato.createdAt).toLocaleTimeString());
            // Asigna los datos de EC, pH, O2, temperatura del agua, etc., a variables
            const ecData = datosIniciales.map(dato => dato.ec);
            const phData = datosIniciales.map(dato => dato.ph);
            const o2Data = datosIniciales.map(dato => dato.o2);
            const tempData = datosIniciales.map(dato => dato.t_agua);
            // Continúa con O2 y temperatura del agua

            const ctx = document.getElementById(idCanvas).getContext('2d');
            myNutricionChart = new Chart(ctx, {
                type: 'line', // Tipo de gráfico
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'EC',
                            data: ecData,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            yAxisID: 'y',
                            hidden: !selectedDataSets.ec
                        },
                        {
                            label: 'pH',
                            data: phData,
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            yAxisID: 'y1',
                            hidden: !selectedDataSets.ph
                        },
                        {
                            label: 'O2',
                            data: o2Data,
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            yAxisID: 'y2',
                            hidden: !selectedDataSets.o2
                            // Configuraciones específicas del dataset
                        },
                        {
                            label: 'temp',
                            data: tempData,
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            yAxisID: 'y3',
                            hidden: !selectedDataSets.temp
                        },
                    ],
                },
                options: {
                    scales: {
                            y: {
                                display: true,
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'EC '
                                }
                            },
                            y1: {
                                display: true, // Asegúrate de que esto esté correctamente referenciado como y1
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'PH '
                                    },
                                    grid: {
                                        drawOnChartArea: false, // Esto asegura que la grilla de este eje no se dibuje en el área del gráfico
                                    }
                                },
                            y2: {
                                display: true,
                                type: 'linear',
                                position: 'right',
                                title: {
                                        display: true,
                                        text: 'O2'
                                    }
                                },
                            y3: {
                                    display: true,
                                    type: 'linear',
                                    position: 'right',
                                    title: {
                                        display: true,
                                        text: 'temp'
                                    }
                                }
                        }

                },
            });
            myNutricionChart.data.datasets = [
                {
                    label: 'EC',
                    data: ecData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y',
                    hidden: !selectedDataSets.ec
                },
                {
                    label: 'PH',
                    data: phData,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    yAxisID: 'y1',
                    hidden: !selectedDataSets.ph
                },
                {
                    label: 'O2',
                    data: o2Data,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y2',
                    hidden: !selectedDataSets.o2
                },
                {
                    label: 'temp',
                    data: tempData,
                    borderColor: 'rgb(3, 169, 244)', // Verde azulado para el borde
                    backgroundColor: 'rgba(3, 169, 244, 0.5)',
                    yAxisID: 'y3',
                    hidden: !selectedDataSets.temp
                },
            ];
            myNutricionChart.update();
        }
    
    async function inicializarGraficoClima(nuevosDatos,idCanvas) {
            const labels = nuevosDatos.map(dato => new Date(dato.createdAt).toLocaleTimeString());
            const temperaturaData = nuevosDatos.map(dato => dato.temperature);
            const humedadData = nuevosDatos.map(dato => dato.humidity);
            const co2Data = nuevosDatos.map(dato => dato.co2);
            const vpdData = nuevosDatos.map(dato => dato.VPD);
            const clima_ctx = document.getElementById('climaChart').getContext('2d');
            myChart = new Chart(clima_ctx,{
                type: 'line', // Tipo de gráfico
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Temperatura',
                            data: temperaturaData,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            yAxisID: 'y',
                            hidden: !selectedDataSets.temperatura
                        },
                        {
                            label: 'Humedad',
                            data: humedadData,
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            yAxisID: 'y1',
                            hidden: !selectedDataSets.humedad
                        },
                        {
                            label: 'CO2',
                            data: co2Data,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            yAxisID: 'y2',
                            hidden: !selectedDataSets.co2
                        },
                        {
                            label: 'VPD',
                            data: vpdData,
                            borderColor: 'rgb(153, 102, 255)',
                            backgroundColor: 'rgba(153, 102, 255, 0.5)',
                            yAxisID: 'y3',
                            hidden: !selectedDataSets.vpd
                        }
                    ],
                options: {
                    scales: {
                            y: {
                                display: true,
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Temperatura (Celsius)',
                                    font: {
                                            size: 14,
                                            weight: 'bold',
                                        },
                                    color: '#000',
                                    padding: {top: 20, bottom: 0}
                                }
                            },
                            y1: {
                                display: true, // Asegúrate de que esto esté correctamente referenciado como y1
                                type: 'linear',
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Humedad (%)',
                                    font: {
                                            size: 14,
                                            weight: 'bold',
                                    },
                                    color: '#000',
                                    padding: {top: 20, bottom: 0}
                                    },
                                grid: {
                                    drawOnChartArea: false, // Esto asegura que la grilla de este eje no se dibuje en el área del gráfico
                                    }
                                },
                            y2: {
                                display: true,
                                type: 'linear',
                                position: 'right',
                                title: {
                                        display: true,
                                        text: 'CO2(ppm)'
                                    }
                                },
                            y3: {
                                    display: true,
                                    type: 'linear',
                                    position: 'right',
                                    title: {
                                        display: true,
                                        text: 'VPD(Pa)'
                                    }
                                }
                        }
                    }

                 }
            });
            myChart.data.datasets [
                // Dataset de Temperatura
                {
                    label: 'Temperatura',
                    data: temperaturaData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderWidth: 2, // Ajusta el grosor de la línea
                    pointRadius: 3, // Ajusta el tamaño del punto
                    yAxisID: 'y',
                    hidden: !selectedDataSets.temperatura
                },
                // Dataset de Humedad
                {
                    label: 'Humedad',
                    data: humedadData,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderWidth: 2,
                    pointRadius: 3,
                    yAxisID: 'y1',
                    hidden: !selectedDataSets.humedad
                },
                // Dataset de CO2
                {
                    label: 'CO2',
                    data: co2Data,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderWidth: 2,
                    pointRadius: 3,
                    yAxisID: 'y2',
                    hidden: !selectedDataSets.co2
                },
                // Dataset de VPD
                {
                    label: 'VPD',
                    data: vpdData,
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    borderWidth: 2,
                    pointRadius: 3,
                    yAxisID: 'y3',
                    hidden: !selectedDataSets.vpd
                }
            ]

            myChart.update();
    }
    function actualizarGraficoNutricionConNuevoDato(nuevoDato) {
        // Agrega la nueva etiqueta (tiempo) al final
        myNutricionChart.data.labels.push(new Date(nuevoDato.createdAt).toLocaleTimeString());

        // Por cada dataset, agrega el nuevo valor independientemente de su estado de selección
        const datasetMappings_Nutricion = {
            'EC': 'ec',
            'PH': 'ph',
            'O2': 'o2',
            'temp': 'temp'
        };

        myNutricionChart.data.datasets.forEach(dataset => {
            const newValue = nuevoDato[datasetMappings_Nutricion[dataset.label]];
            dataset.data.push(newValue);

            // Aquí decides si el dataset debe ser ocultado o no, basado en selectedDataSets
            dataset.hidden = !selectedDataSets[dataset.label.toLowerCase()];
        });

        // Opcional: elimina el primer dato si se excede el número máximo de puntos deseado
        if (myNutricionChart.data.labels.length > 5) { // Ajusta este valor según necesites
            myNutricionChart.data.labels.shift(); // Elimina la primera etiqueta

            // Elimina el primer valor de cada conjunto de datos
            myNutricionChart.data.datasets.forEach(dataset => {
                dataset.data.shift();
            });
        }

        // Finalmente, actualiza el gráfico para reflejar los cambios
        myNutricionChart.update({
            duration: 800, // Duración de la animación de actualización
            easing: 'linear' // Tipo de animación para una transición suave
        });
    }
    function actualizarGraficoClimaConNuevoDato(nuevoDato) {
        // Agrega la nueva etiqueta (tiempo) al final
        myChart.data.labels.push(new Date(nuevoDato.createdAt).toLocaleTimeString());

        // Por cada dataset, agrega el nuevo valor independientemente de su estado de selección
        const datasetMappings = {
            'Temperatura': 'temperature',
            'Humedad': 'humidity',
            'CO2': 'co2',
            'VPD': 'vpd'
        };

        myChart.data.datasets.forEach(dataset => {
            const newValue = nuevoDato[datasetMappings[dataset.label]];
            dataset.data.push(newValue);

            // Aquí decides si el dataset debe ser ocultado o no, basado en selectedDataSets
            dataset.hidden = !selectedDataSets[dataset.label.toLowerCase()];
        });

        // Opcional: elimina el primer dato si se excede el número máximo de puntos deseado
        if (myChart.data.labels.length > 5) { // Ajusta este valor según necesites
            myChart.data.labels.shift(); // Elimina la primera etiqueta

            // Elimina el primer valor de cada conjunto de datos
            myChart.data.datasets.forEach(dataset => {
                dataset.data.shift();
            });
        }

        // Finalmente, actualiza el gráfico para reflejar los cambios
        myChart.update({
            duration: 800, // Duración de la animación de actualización
            easing: 'linear' // Tipo de animación para una transición suave
        });
    }
    document.querySelectorAll('.value-box').forEach(box => {
        box.addEventListener('click', function(event) {
                const seriesName = event.currentTarget.dataset.series;
                selectedDataSets[seriesName] = !selectedDataSets[seriesName];
                obtenerYActualizarDatos(); // Esto refrescará el gráfico con las series activas/inactivas
            });
        });
    
    function toggleDataSeries(event) {
        const seriesName = event.currentTarget.dataset.series;
        selectedDataSets[seriesName] = !selectedDataSets[seriesName];
        obtenerYActualizarDatos(); // Esto refrescará el gráfico con las series activas/inactivas
    }
    function actualizarValoresActuales(nuevosDatos) {
        // Suponiendo que el último dato es el más reciente
        const ultimoDato = nuevosDatos[nuevosDatos.length - 1];
        const nuevoDato = {
                createdAt: new Date(), // La fecha y hora actual como ejemplo
                temperature: ultimoDato.temperature, // Ejemplo de temperatura
                humidity: ultimoDato.humidity, // Ejemplo de humedad
                co2: ultimoDato.co2,
                vpd:ultimoDato.VPD,
                o2: ultimoDato.o2, 
                ph: ultimoDato.ph, 
                ec: ultimoDato.ec,
                temp:ultimoDato.t_agua,
            };
        
        actualizarGraficoNutricionConNuevoDato(nuevoDato)
        actualizarGraficoClimaConNuevoDato(nuevoDato)
        // Actualiza aquí los valores actuales basándote en 'ultimoDato'
        // Ejemplo:
        document.querySelector("#valor-temperatura").textContent = `${ultimoDato.temperature}°C`;
        evaluarTemperatura();
        document.querySelector("#valor-humedad").textContent = ` ${ultimoDato.humidity}%`;
        evaluarHumedad();
        document.querySelector("#valor-co2").textContent = ` ${ultimoDato.co2}ppm`;
        evaluarCO2()
        document.querySelector("#valor-vpd").textContent = ` ${ultimoDato.VPD}Pa`;
        evaluarVPD()
        
        document.querySelector("#valor-ec").textContent = ` ${ultimoDato.ec}ms/seg`;
        document.querySelector("#valor-ph").textContent = ` ${ultimoDato.ph}`;
        document.querySelector("#valor-o2").textContent = ` ${ultimoDato.o2}ppm`;
        document.querySelector("#valor-temp").textContent = ` ${ultimoDato.t_agua}°C`;
    }


    document.getElementById('climaChart').addEventListener('mouseover', function() {
    
    document.querySelectorAll('.move-on-hover').forEach(function(box) {
            box.style.transform = 'translateX(-60px)'; // Mueve los valores seleccionados hacia la izquierda
            box.style.transition = 'transform 0.3s ease'; // Suaviza la transición
        });
    });
    document.getElementById('climaChart').addEventListener('mouseout', function() {
        document.querySelectorAll('.move-on-hover').forEach(function(box) {
            box.style.transform = 'translateX(0px)'; // Devuelve los valores seleccionados a su posición original
        });
    });


    document.getElementById('nutricionChart').addEventListener('mouseover', function() {
    
    document.querySelectorAll('.move-on-hover-2').forEach(function(box) {
            box.style.transform = 'translateX(-60px)'; // Mueve los valores seleccionados hacia la izquierda
            box.style.transition = 'transform 0.3s ease'; // Suaviza la transición
        });
    });
    document.getElementById('nutricionChart').addEventListener('mouseout', function() {
        document.querySelectorAll('.move-on-hover-2').forEach(function(box) {
            box.style.transform = 'translateX(0px)'; // Devuelve los valores seleccionados a su posición original
        });
    });
    function evaluarTemperatura() {
        const valorTemperaturaElement = document.getElementById("valor-temperatura");
        const temperaturaImg = document.querySelector(".value-box[data-series='temperatura'] img");
        const iconoClimatizacionImg = document.getElementById("icono-climatizacion");
        const valorTemperatura = parseFloat(valorTemperaturaElement.textContent.replace('°C', ''));

        const umbralTemperatura_inferior = 22; // Define tu valor umbral aquí
        const umbralTemperatura_superior = 29; // Define tu valor umbral aquí
        const umbralTemperatura_superior_alerta = 35; // Define tu valor umbral aquí

        if (valorTemperatura <= umbralTemperatura_inferior) {
            // Si la temperatura está por debajo del umbral
            temperaturaImg.src = "imagenes/frio_off.png";
        } 
        else if (valorTemperatura > umbralTemperatura_inferior && valorTemperatura <= umbralTemperatura_superior) {
        // Si la temperatura está en el rango medio
            temperaturaImg.src = "imagenes/temperatura.png";
        } else if (valorTemperatura > umbralTemperatura_superior && valorTemperatura < umbralTemperatura_superior_alerta) {
            // Si la temperatura está en el rango superior sin llegar a la alerta
             temperaturaImg.src = "imagenes/temperatura_alta_off.png";
        } else {
            // Si la temperatura supera el umbral de alerta superior
            temperaturaImg.src = "imagenes/temperatura_alerta.png";
            iconoClimatizacionImg.src = "imagenes/clima_alerta.png";
        }
    }
    function evaluarHumedad() {
            const valorHumedadElement = document.getElementById("valor-humedad");
            const humedadImg = document.querySelector(".value-box[data-series='humedad'] img");
            const iconoClimatizacionImg = document.getElementById("icono-climatizacion");
            const valorHumedad = parseFloat(valorHumedadElement.textContent.replace('%', ''));

            const umbralHumedad_baja = 30; // Define tu valor umbral para humedad baja aquí
            const umbralHumedad_optima_inferior = 60; // Define el umbral inferior para la humedad óptima aquí
            const umbralHumedad_optima_superior = 70; // Define el umbral superior para la humedad óptima aquí
            const umbralHumedad_alta = 80; // Define tu valor umbral para humedad alta aquí

            if (valorHumedad < umbralHumedad_baja) {
                // Si la humedad está por debajo del umbral de humedad baja
                humedadImg.src = "imagenes/humedad_baja.png";
            } else if (valorHumedad >= umbralHumedad_optima_inferior && valorHumedad <= umbralHumedad_optima_superior) {
                // Si la humedad está en el rango óptimo
                humedadImg.src = "imagenes/humedad_normal_2.png";
            } else if (valorHumedad > umbralHumedad_alta) {
                // Si la humedad supera el umbral de humedad alta
                humedadImg.src = "imagenes/humedad_alta.png";
                iconoClimatizacionImg.src = "imagenes/clima_alerta.png";
            }
        }

    function evaluarCO2() {
            const valorCO2Element = document.getElementById("valor-co2");
            const co2Img = document.querySelector(".value-box[data-series='co2'] img");
            const iconoClimatizacionImg = document.getElementById("icono-climatizacion");
            const valorCO2 = parseFloat(valorCO2Element.textContent.replace('ppm', ''));

            // Define tus umbrales para CO2 aquí
            const umbralCO2_bajo = 350; // Valor ejemplar, ajusta según sea necesario
            const umbralCO2_optimo_inferior = 400; // Valor ejemplar, ajusta según sea necesario
            const umbralCO2_optimo_superior = 500; // Valor ejemplar, ajusta según sea necesario
            const umbralCO2_alto = 800; // Valor ejemplar, ajusta según sea necesario

            if (valorCO2 < umbralCO2_bajo) {
                // CO2 demasiado bajo
                co2Img.src = "imagenes/co2_bajo.png"; // Ajusta la ruta de tu imagen para CO2 bajo
            } else if (valorCO2 >= umbralCO2_bajo && valorCO2 < umbralCO2_optimo_inferior) {
                // CO2 está aumentando pero aún no es óptimo
                co2Img.src = "imagenes/co2.png"; // Ajusta la ruta de tu imagen para CO2 subiendo
            } else if (valorCO2 >= umbralCO2_optimo_inferior && valorCO2 <= umbralCO2_optimo_superior) {
                // CO2 en nivel óptimo
                co2Img.src = "imagenes/co2_alerta.png"; // Ajusta la ruta de tu imagen para CO2 óptimo
            } else if (valorCO2 > umbralCO2_optimo_superior && valorCO2 < umbralCO2_alto) {
                // CO2 alto pero no crítico
                co2Img.src = "imagenes/co2_bajo.png"; // Ajusta la ruta de tu imagen para CO2 alto
            } else {
                // CO2 críticamente alto
                co2Img.src = "imagenes/co2_alerta.png"; // Ajusta la ruta de tu imagen para CO2 crítico
                iconoClimatizacionImg.src = "imagenes/clima_alerta.png";
            }
        }
    function evaluarVPD() {
            const valorVPDElement = document.getElementById("valor-vpd");
            const vpdImg = document.querySelector(".value-box[data-series='vpd'] img");
            const iconoClimatizacionImg = document.getElementById("icono-climatizacion");
            const valorVPD = parseFloat(valorVPDElement.textContent.replace('Pa', '').trim());

            // Define tus umbrales para VPD aquí
            const umbralVPD_bajo = 400; // Ejemplo, ajusta según necesidad
            const umbralVPD_optimo_inferior = 600; // Ejemplo, ajusta según necesidad
            const umbralVPD_optimo_superior = 900; // Ejemplo, ajusta según necesidad
            const umbralVPD_alto = 1500; // Ejemplo, ajusta según necesidad

            if (valorVPD < umbralVPD_bajo) {
                // VPD demasiado bajo
                vpdImg.src = "imagenes/vpd.png"; // Ajusta la ruta de tu imagen para VPD bajo
            } else if (valorVPD >= umbralVPD_bajo && valorVPD < umbralVPD_optimo_inferior) {
                // VPD está aumentando pero aún no es óptimo
                vpdImg.src = "imagenes/vpd.png"; // Ajusta la ruta de tu imagen para VPD subiendo
            } else if (valorVPD >= umbralVPD_optimo_inferior && valorVPD <= umbralVPD_optimo_superior) {
                // VPD en nivel óptimo
                vpdImg.src = "imagenes/vpd.png"; // Ajusta la ruta de tu imagen para VPD óptimo
            } else if (valorVPD > umbralVPD_optimo_superior && valorVPD < umbralVPD_alto) {
                // VPD alto pero no crítico
                vpdImg.src = "imagenes/vpd.png"; // Ajusta la ruta de tu imagen para VPD alto
            } else {
                // VPD críticamente alto
                vpdImg.src = "imagenes/vpd.png"; // Ajusta la ruta de tu imagen para VPD crítico
                iconoClimatizacionImg.src = "imagenes/clima_alerta.png";
                
            }
        }

    });
    function toggleButton(button) {
        // Verifica si el botón está "encendido" a través de un atributo personalizado
        const isOn = button.getAttribute('data-is-on') === 'true';

        // Cambia el estado del botón
        if (isOn) {
            console.log('isON')
            button.setAttribute('data-is-on', 'false'); // Establece el estado a "apagado"
            button.children[0].src = button.getAttribute('data-off'); // Cambia el ícono a "apagado"
        } else {
            button.setAttribute('data-is-on', 'true'); // Establece el estado a "encendido"
            button.children[0].src = button.getAttribute('data-on'); // Cambia el ícono a "encendido"
        }
    }

    function changeIcon(button, icon) {
        // Cambia el ícono solo si el botón no está "encendido"
        const isOn = button.getAttribute('data-is-on') === 'true';
        if (!isOn) {
            button.children[0].src = icon;
        }
    }