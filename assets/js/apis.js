$(document).ready(function () {
  $("form").submit(function (event) {
    event.preventDefault();
    let input = $("#heroInput").val();
    $.ajax({
      type: "GET",
      url: "https://superheroapi.com/api.php/3033707663582647/" + input,
      dataType: "json",
      success: function (data) {
        
        let nombre = check(data.name, "personal");
        let conexion = check(data.connections["group-affiliation"],"personal");
        let fecha = check(data.biography.publisher, "personal");
        let ocupacion = check(data.work.occupation);
        let aparicion = check(data.biography["first-appearance"],"personal");
        let altura = check(data.appearance.height[0], "personal");
        let peso = check(data.appearance.weight[0], "personal");
        let alias = check(data.biography.aliases[0], "personal");
        $("#heroInfo").html(`
                    <div class="row">
                        <div class="col-md-4 my-auto text-center">
                            <img id="heroImg" src="${check(data.image.url,"img")}" height="350px" />
                        </div>
                        <div class="col-md-4">
                            <div class="card-body">
                                <h5 class="card-text"><b>NOMBRE:</b></h5>
                                <h4 class="card-title"><b>${nombre}</b></h4>
                                <p class="card-text"><b>CONEXIONES:</b>${conexion} .</p>
                                <p class="card-text"><b>FECHA DE PUBLICACION:</b> ${fecha}.</p>
                                <p class="card-text"><b>OCUPACION:</b> ${ocupacion}.</p>
                                <p class="card-text"><b>PRIMERA APARICION:</b> ${aparicion}.</p>
                                <p class="card-text"><b>ALTURA:</b> ${altura}.</p>
                                <p class="card-text"><b>PESO:</b> ${peso}.</p>
                                <p class="card-text"><b>ALIAS:</b> ${alias}.</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div id="heroStats" style="height: 360px; width: 100%"></div>
                        </div>
                    </div>
                `);

        // Generar gráfico de estadísticas
        const estadisticas = [];
        estadisticas.push(
          {
            y: check(data.powerstats.intelligence, null),
            label: "Inteligencia",
          },
          { y: check(data.powerstats.strength, null), label: "Fuerza" },
          { y: check(data.powerstats.speed, null), label: "Velocidad" },
          { y: check(data.powerstats.durability, null), label: "Resistencia" },
          { y: check(data.powerstats.power, null), label: "Poder" },
          { y: check(data.powerstats.combat, null), label: "Combate" }
        );

        const config = {
          theme: "light1",
          animationEnabled: true,
          title: {
            text: "Estadísticas de Poder para " + data.name,
          },
          data: [
            {
              type: "pie",
              startAngle: 25,
              toolTipContent: "<b>{label}</b>: {y}",
              showInLegend: true,
              legendText: "{label} - {y}",
              indexLabelFontSize: 16,
              indexLabel: "{label} - {y}",
              dataPoints: estadisticas,
            },
          ],
        };

        let chart = new CanvasJS.Chart("heroStats", config);
        chart.render();
      },
      error: function (error) {
        console.error("Ocurrió un error:", error);
      },
    });
  });
});

function check(dato, type) {
  if (type === "personal") {
    return dato.startsWith("-") ? "No disponible" : dato;
  } else if (type === "img") {
    return dato ===
      "https://www.superherodb.com/pictures2/portraits/10/100/1010.jpg"
      ? "https://png.pngtree.com/png-clipart/20230802/original/pngtree-strong-yellow-super-hero-happy-help-illustration-vector-picture-image_9275736.png"
      : dato;
  } else {
    return dato === "null" ? Math.ceil(Math.random() * 100) : dato;
  }
}
