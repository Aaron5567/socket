//mensja de sockets

const {io} = require('./index');
const Band = require('./models/band');
const Bands = require('./models/Bands');

const bands =  new Bands();



// no reinicializar 
bands.addBand( new Band('superman'));
bands.addBand( new Band('aquaman'));
bands.addBand( new Band('capitan america'));
bands.addBand( new Band('spiderman'));

// console.log(bands);

io.on('connection', client => {

    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect',() =>{
        console.log('cliente desconectado');
    })

    client.on('mensajeop',( resp ) => {
        console.log('Recibi Mensjae al servidor', resp);

        io.emit('mensajetodo', {admin: 'nuevo mensaje' });
    });

    client.on('emitir-mensaje',( resp ) => {

      //  console.log(resp);

        // io.emit('nuevo-mensaje', resp); // emite a todos los cliente
        client.broadcast.emit('nuevo-mensaje', resp); // emite a todos menos el que lo emitio

    });


    client.on('vote-band', (payload) => {
      //  console.log(payload.id);
        bands.voteBand( payload.id );
        io.emit('active-bands', bands.getBands() );
    });


    client.on( 'add-band', (data) => {
        //   console.log(data);
          const newBand = new Band(data.name);
          bands.addBand(newBand);
          io.emit('active-bands', bands.getBands() );
      });

      client.on('delete-band', (data) => {
        //  console.log(payload.id);
          bands.deleteBand(data.item);
          io.emit('active-bands', bands.getBands() );
      });
  

    
    

});
