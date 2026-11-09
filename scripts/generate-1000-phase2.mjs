import fs from "fs";

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ============================================================================
// SILO 1: 120 URBANIZACIONES Y EJES COMERCIALES DE LIMA Y CALLAO (120)
// ============================================================================
const LIMA_ZONES = [
  // Miraflores (10)
  ["Parque Kennedy y Centro", "Miraflores", "Humedad costera 84% y alta actividad peatonal", "Av. Larco, Calle Berlín y Diagonal"],
  ["La Aurora y Roca y Boloña", "Miraflores", "Microclima templado residencial con parques", "Av. Roca y Boloña, Av. Benavides y Calle Arias Schreiber"],
  ["Reducto y Armendáriz", "Miraflores", "Brisa marina directa desde la quebrada de Armendáriz", "Av. Reducto, Av. 28 de Julio y Paseo de la República"],
  ["Santa Cruz y Mariscal La Mar", "Miraflores", "Neblina costera matinal en eje gastronómico", "Av. Mariscal La Mar, Av. Santa Cruz y Calle General Mendiburu"],
  ["Malecón Cisneros y Reserva", "Miraflores", "Viento salino constante frente al mar", "Malecón Cisneros, Malecón de la Reserva y Calle Bellavista"],
  ["San Antonio y 28 de Julio", "Miraflores", "Clima templado húmedo tradicional", "Av. 28 de Julio, Av. Reducto y Calle Ramón Ribeyro"],
  ["Ovalo Gutiérrez y Comandante Espinar", "Miraflores", "Ambiente cosmopolita con brisa templada", "Av. Comandante Espinar, Av. Angamos Oeste y Av. Santa Cruz"],
  ["Calle Shell y Bajada Balta", "Miraflores", "Alta concentración comercial y humedad marina", "Calle Shell, Bajada Balta y Av. José Larco"],
  ["Av. José Pardo y Óvalo Miraflores", "Miraflores", "Corredor comercial de oficinas climatizadas", "Av. José Pardo, Av. Arequipa y Calle Atahualpa"],
  ["Barrio Médico y Límite Surquillo", "Miraflores", "Clima urbano templado y húmedo", "Calle Sergio Bernales, Av. Roca y Boloña y Av. República de Panamá"],
  // San Isidro (10)
  ["Centro Financiero Rivera Navarrete", "San Isidro", "Oficinas con aire acondicionado que reseca la piel facial", "Av. Rivera Navarrete, Av. Canaval y Moreyra y Calle Las Begonias"],
  ["El Golf y Country Club", "San Isidro", "Microclima fresco rodeado de áreas verdes", "Av. Santo Toribio, Av. Paz Soldán y Calle Los Eucaliptos"],
  ["El Olivar y Conquistadores", "San Isidro", "Humedad natural de bosque urbano y sombra", "Av. Conquistadores, Calle Choquehuanca y Parque El Olivar"],
  ["Córpac y Guardia Civil", "San Isidro", "Corredor empresarial templado", "Av. Guardia Civil, Av. Parque Norte y Calle República de Colombia"],
  ["Orrantia del Mar y Pezet", "San Isidro", "Brisa oceánica directa del acantilado", "Av. General Juan Antonio Pezet, Av. Salaverry y Av. del Ejército"],
  ["Camino Real y Libertador", "San Isidro", "Eje comercial y boutique con humedad moderada", "Av. Camino Real, Calle Miguel Dasso y Av. Jorge Basadre"],
  ["Dos de Mayo y Javier Prado Oeste", "San Isidro", "Arbolado residencial con brisa fresca", "Av. Dos de Mayo, Av. Javier Prado Oeste y Calle Los Castaños"],
  ["Canaval y Moreyra y República de Panamá", "San Isidro", "Flujo ejecutivo constante y polución vehicular", "Av. Canaval y Moreyra, Av. República de Panamá y Av. Aramburú"],
  ["Corpac Sur y Parque Sur", "San Isidro", "Microclima templado residencial", "Av. Parque Sur, Av. Gálvez Barrenechea y Calle 41"],
  ["Miguel Dasso y Santa Luisa", "San Isidro", "Ambiente comercial exclusivo y brisa marina", "Calle Miguel Dasso, Av. Camino Real y Calle Conquistadores"],
  // Santiago de Surco (12)
  ["Chacarilla del Estanque", "Santiago de Surco", "Clima templado residencial con parques amplios", "Av. Primavera, Av. Caminos del Inca y Calle Monte Rosa"],
  ["Monterrico y El Derby", "Santiago de Surco", "Mayor radiación solar y menor humedad que la costa", "Av. El Derby, Av. Manuel Olguín y Av. Primavera"],
  ["El Polo y La Encalada", "Santiago de Surco", "Clima seco-templado en zona corporativa", "Av. El Polo, Av. La Encalada y Calle El Golf Los Incas"],
  ["La Arbolada y Los Antares", "Santiago de Surco", "Clima templado urbano en el corazón de Surco", "Calle Los Antares, Av. Caminos del Inca y Av. Tomás Marsano"],
  ["Higuereta y Óvalo Cabitos", "Santiago de Surco", "Eje comercial dinámico con clima templado", "Av. Benavides, Av. Aviación y Paseo La Castellana"],
  ["Valle Hermoso y Jacarandá", "Santiago de Surco", "Microclima soleado al pie de las lomas", "Av. Valle Hermoso, Av. Jacarandá y Av. Velasco Astete"],
  ["Casuarinas Sur y Panamericana", "Santiago de Surco", "Brisa fresca de altura con sol gran parte del año", "Av. Las Casuarinas, Av. Primavera y Calle Las Magnolias"],
  ["Chama y Loma Amarilla", "Santiago de Surco", "Clima templado con brisa de parque ecológico", "Av. Benavides, Av. Caminos del Inca y Parque Loma Amarilla"],
  ["Sagitario y La Bolichera", "Santiago de Surco", "Humedad moderada en eje sur de Lima", "Av. Tomás Marsano, Av. Próceres y Av. Guardia Civil Sur"],
  ["Las Gardenias y Velasco Astete", "Santiago de Surco", "Zona residencial tranquila y templada", "Av. Alejandro Velasco Astete, Av. Benavides y Calle Mercaderes"],
  ["Surco Pueblo y Plaza Mayor", "Santiago de Surco", "Tradición limeña con clima templado húmedo", "Jr. Batalla de Ayacucho, Av. Jorge Chávez y Av. Caminos del Inca"],
  ["Camacho Límite Surco y Javier Prado", "Santiago de Surco", "Clima soleado y seco ideal para hidratación en crema", "Av. Javier Prado Este, Av. El Golf Los Incas y Av. Circunvalación"],
  // La Molina (8)
  ["La Planicie y El Sol de La Molina", "La Molina", "Microclima seco y soleado los 12 meses del año", "Av. La Molina, Calle Las Dunas y Av. Elías Aparicio"],
  ["Camacho y Los Frutales", "La Molina", "Radiación solar alta y baja humedad ambiental", "Av. Javier Prado Este, Av. Las Palmeras y Av. Los Frutales"],
  ["La Fontana y Raúl Ferrero", "La Molina", "Brisa seca de cerros con mañanas soleadas", "Av. Raúl Ferrero, Av. La Fontana y Av. El Corregidor"],
  ["Rinconada del Lago y Molicentro", "La Molina", "Clima cálido diurno y noches frescas de quebrada", "Av. La Molina, Calle El Haras y Av. Laguna Grande"],
  ["Santa Patricia y Constructores", "La Molina", "Zona residencial moderna con sol frecuente", "Av. Los Constructores, Av. Flora Tristán y Av. Melgarejo"],
  ["Mayorazgo Límite La Molina", "La Molina", "Clima templado-seco en eje universitario", "Av. Separadora Industrial, Av. Huarochirí y Av. Javier Prado"],
  ["Viñas de La Molina y Corregidor", "La Molina", "Viento seco en altura y radiación UV moderada-alta", "Av. El Corregidor, Calle Las Viñas y Av. Los Fresnos"],
  ["Las Lagunas y Club Las Lagunas", "La Molina", "Microclima soleado con brisa ligera", "Av. Laguna Grande, Av. La Molina y Calle Las Gaviotas"],
  // San Borja (6)
  ["San Borja Norte y Pentagonito", "San Borja", "Abundantes áreas verdes y humedad equilibrada", "Av. San Borja Norte, Av. Boulevard de Surco y Av. Velasco Astete"],
  ["San Borja Sur y Parque de la Felicidad", "San Borja", "Corredor deportivo al aire libre con brisa templada", "Av. San Borja Sur, Av. Aviación y Av. San Luis"],
  ["Chacarilla San Borja y Primavera", "San Borja", "Clima residencial templado y limpio", "Av. Primavera, Av. Buena Vista y Av. Del Parque Sur"],
  ["Eje Aviación y La Cultura", "San Borja", "Zona comercial y cultural muy transitada", "Av. Aviación, Av. Javier Prado Este y Calle Carpaccio"],
  ["Las Torres de Limatambo y Angamos", "San Borja", "Microclima urbano templado", "Av. Angamos Este, Av. Principal y Calle Morelli"],
  ["Córpac San Borja y Guardia Civil", "San Borja", "Zona empresarial y médica de alta afluencia", "Av. Guardia Civil, Av. Del Parque Norte y Av. Gálvez Barrenechea"],
  // Barranco & Chorrillos (6)
  ["Boulevard de Barranco y Puente de los Suspiros", "Barranco", "Alta humedad marina y brisa bohemia nocturna", "Av. Pedro de Osma, Av. Grau y Bajada de Baños"],
  ["El Sol y Malecón Paul Harris", "Barranco", "Viento oceánico directo sobre acantilados", "Malecón Paul Harris, Av. San Martín y Calle Centenario"],
  ["Plaza Butters y Balta", "Barranco", "Clima costero tradicional húmedo", "Av. Nicolás de Piérola, Av. Bolognesi y Jr. Unión"],
  ["La Encantada de Villa y Pantanos", "Chorrillos", "Brisa marina fresca y reservas naturales", "Av. Alameda San Marcos, Av. Hernando Lavalle y Malecón de Chorrillos"],
  ["Matellini y Paseo de la República", "Chorrillos", "Clima templado costero en eje sur", "Av. Paseo de la República, Av. Ariosto Matellini y Av. El Sol"],
  ["Cedros de Villa y Huaylas", "Chorrillos", "Viento marino constante frente al Pacífico", "Av. Defensores del Morro (Huaylas), Av. Alameda Sur y Calle Islas Ballestas"],
  // Jesús María, Lince, Magdalena, Pueblo Libre, San Miguel (18)
  ["Residencial San Felipe y Gregorio Escobedo", "Jesús María", "Microclima arbolado y templado", "Av. Gregorio Escobedo, Av. Salaverry y Av. Sánchez Carrión"],
  ["Campo de Marte y Av. Salaverry", "Jesús María", "Brisa fresca del pulmón verde de Lima", "Av. Salaverry, Av. De la Peruanidad y Jr. Nazca"],
  ["Damero Comercial Garzón y Brasil", "Jesús María", "Alta actividad comercial y clima templado", "Av. Brasil, Av. General Garzón y Jr. Huiracocha"],
  ["Risso y Petit Thouars", "Lince", "Eje gastronómico y nocturno con clima urbano", "Av. Arequipa, Av. Petit Thouars y Jr. Risso"],
  ["Parque Mariscal Castilla y Dos de Mayo", "Lince", "Zona residencial arbolada limítrofe con San Isidro", "Av. César Vallejo, Av. Canevaro y Parque Castilla"],
  ["Arenales y Centro Comercial", "Lince", "Corredor comercial juvenil y dinámico", "Av. Arenales, Av. Arequipa y Calle Manuel Segura"],
  ["Malecón Castagnola y Costa Verde", "Magdalena del Mar", "Brisa marina intensa y humedad 85%", "Malecón Grau, Av. del Ejército y Av. Sucre"],
  ["Ovalo Indepedencia y Brasil", "Magdalena del Mar", "Zona residencial moderna de alta densidad", "Av. Brasil, Av. Javier Prado Oeste y Jr. Bolognesi"],
  ["Mercado y Boulevard José Gálvez", "Magdalena del Mar", "Clima costero templado tradicional", "Jr. José Gálvez, Av. Sucre y Jr. Leoncio Prado"],
  ["Plaza Bolívar y Zona Histórica", "Pueblo Libre", "Clima templado y menos húmedo que el malecón", "Av. General Vivanco, Av. Sucre y Calle Antonio Polo"],
  ["Parque El Carmen y Cueva", "Pueblo Libre", "Zona residencial tranquila y arbolada", "Av. Bolívar, Av. Brasil y Calle Juan Valer"],
  ["Av. La Marina y Plaza San Miguel", "San Miguel", "Corredor comercial costero con viento marino", "Av. La Marina, Av. Universitaria y Calle Mantaro"],
  ["Costanera y Malecón Bertolotto", "San Miguel", "Exposición directa a la brisa salina del mar", "Av. Costanera, Av. Bertolotto y Av. La Paz"],
  ["Maranga y Parque de las Leyendas", "San Miguel", "Microclima templado residencial", "Av. Precursores, Av. Faucett y Av. Escardó"],
  ["Pando y Zona Universitaria", "San Miguel", "Ambiente juvenil y clima costero moderado", "Av. Universitaria, Av. Riva Agüero y Av. Venezuela"],
  ["Barrio Médico y Angamos", "Surquillo", "Clima templado céntrico junto a Miraflores", "Av. Angamos Este, Av. Tomás Marsano y Calle Manuel Irribarren"],
  ["La Calera de la Merced", "Surquillo", "Zona residencial tranquila entre Surco y San Borja", "Av. Aviación, Av. Villarán y CalleJJ Paso"],
  ["Limatambo y República de Panamá", "Surquillo", "Corredor corporativo y automotriz", "Av. República de Panamá, Av. Aramburú y Av. Domingo Orué"],
  // Lima Norte (16)
  ["MegaPlaza e Izaguirre", "Los Olivos", "Clima cálido en verano y templado en invierno", "Av. Carlos Izaguirre, Av. Alfredo Mendiola y Av. Las Palmeras"],
  ["Covida y Antúnez de Mayolo", "Los Olivos", "Eje comercial y gastronómico de Lima Norte", "Av. Antúnez de Mayolo, Av. Las Palmeras y Av. Universitaria"],
  ["Pro y Huandoy", "Los Olivos", "Clima templado-cálido con menor humedad marina", "Av. Próceres de Huandoy, Av. Canta Callao y Panamericana Norte"],
  ["Villa Sol y Universitaria", "Los Olivos", "Corredor universitario y residencial activo", "Av. Universitaria, Av. Marañón y Av. Angélica Gamarra"],
  ["Plaza Norte y Tomás Valle", "Independencia", "Hub comercial y empresarial de Lima Norte", "Av. Tomás Valle, Av. Túpac Amaru y Panamericana Norte"],
  ["Tahuantinsuyo y Ermitaño", "Independencia", "Brisa seca de lomas en parte alta", "Av. Túpac Amaru, Av. Chinchaysuyo y Av. Industrial"],
  ["Retablo y Belaunde", "Comas", "Boulevard comercial dinámico con clima templado-seco", "Av. Víctor Andrés Belaunde, Av. Universitaria y Av. Retablo"],
  ["Santa Luzmila y Trapiche", "Comas", "Mayor radiación solar hacia el valle del Chillón", "Av. Gerardo Unger, Av. Trapiche y Av. México"],
  ["Collique y Túpac Amaru", "Comas", "Clima seco y soleado gran parte del año", "Av. Túpac Amaru, Av. Revolución y Av. San Felipe"],
  ["Fiori y Caquetá", "San Martín de Porres", "Eje comercial de alto tránsito en Lima Norte", "Av. Eduardo de Habich, Av. Zarumilla y Av. Perú"],
  ["Av. Perú y Quilca", "San Martín de Porres", "Clima templado húmedo tradicional", "Av. Perú, Av. Universitaria y Av. Lima"],
  ["Oquendo y Canta Callao", "San Martín de Porres", "Brisa costera del límite con el Callao", "Av. Canta Callao, Av. Bertello y Av. Naranjal"],
  ["Tungasuca y San Felipe", "Carabayllo", "Clima cálido y soleado del valle norte", "Av. Universitaria, Av. Chimpu Ocllo y Av. Túpac Amaru"],
  ["Shangrilá y Zapallal", "Puente Piedra", "Ambiente soleado con viento moderado", "Panamericana Norte, Av. Lecaros y Av. San Juan de Dios"],
  ["Balneario de Ancón", "Ancón", "Brisa marina norteña y sol de verano", "Malecón Ferreyros, Av. Dos de Mayo y Playa Hermosa"],
  ["Santa Rosa y Country Club", "Santa Rosa", "Viento oceánico directo y humedad costera", "Av. Alejandro Bertello y Malecón Santa Rosa"],
  // Lima Este (16)
  ["Mayorazgo y Ceres", "Ate", "Clima templado-seco con sol frecuente", "Av. Javier Prado Este, Av. Prolongación Javier Prado y Carretera Central"],
  ["Salamanca de Monterrico", "Ate", "Microclima templado residencial junto a Surco", "Av. Circunvalación, Av. Los Quechuas y Av. Paracas"],
  ["Puruchuco y Real Plaza", "Ate", "Sol constante y baja humedad ambiental", "Carretera Central, Av. Nicolás Ayllón y Vista Alegre"],
  ["Huaycán y Santa Clara", "Ate", "Clima cálido y seco todo el año (sol de Lima Este)", "Av. José Carlos Mariátegui, Carretera Central y Qollana"],
  ["Zárate y Gran Chimú", "San Juan de Lurigancho", "Eje comercial principal con clima templado-seco", "Av. Gran Chimú, Av. Próceres de la Independencia y Malecón Checa"],
  ["Las Flores de Lima y Los Jardines", "San Juan de Lurigancho", "Microclima cálido y menor neblina invernal", "Av. Los Tusílagos, Av. Los Postes y Av. Lurigancho"],
  ["Canto Grande y Mariscal Cáceres", "San Juan de Lurigancho", "Radiación solar alta y ambiente seco", "Av. Fernando Wiesse, Av. Canto Grande y Av. Central"],
  ["Mangomarca y Campoy", "San Juan de Lurigancho", "Brisa de lomas y clima templado", "Av. Santuario, Av. Malecón Checa y Panorama"],
  ["Los Ruiseñores y Óvalo Santa Anita", "Santa Anita", "Clima templado-soleado en zona comercial", "Av. Nicolás Ayllón, Av. Los Ruiseñores y Av. Metropolitana"],
  ["Productores y Chancas", "Santa Anita", "Actividad comercial intensa y clima seco", "Av. De la Cultura, Av. Ferrocarril y Vía de Evitamiento"],
  ["Huachipa y Carapongo", "Lurigancho-Chosica", "Sol permanente y clima campestre seco", "Av. Las Torres, Av. Capitana y Ramiro Prialé"],
  ["Chosica Centro y Parque Echenique", "Lurigancho-Chosica", "Clima seco de sierra baja con sol los 365 días", "Av. Lima Sur, Av. 28 de Julio y Carretera Central"],
  ["Chaclacayo y Los Cóndores", "Chaclacayo", "Aire puro y seco ideal para cremas hidratantes", "Carretera Central, Av. Nicolás Ayllón y Calle Las Begonias"],
  ["Cieneguilla y Tambo Viejo", "Cieneguilla", "Sol radiante y baja humedad del valle de Lurín", "Av. Nueva Toledo, Av. Manco Cápac y Río Seco"],
  ["El Agustino y Puente Nuevo", "El Agustino", "Clima urbano templado en puerta de Lima Este", "Av. Riva Agüero, Av. César Vallejo y Vía de Evitamiento"],
  ["San Luis y La Videna", "San Luis", "Microclima céntrico junto a San Borja", "Av. Canadá, Av. San Luis y Av. Del Aire"],
  // Lima Centro & Lima Sur & Callao (18)
  ["Centro Histórico y Jirón de la Unión", "Cercado de Lima", "Clima tradicional limeño húmedo en invierno", "Jr. de la Unión, Plaza San Martín y Av. Abancay"],
  ["Santa Beatriz y Parque de la Reserva", "Cercado de Lima", "Brisa fresca de parques y fuentes", "Av. Arequipa, Av. Petit Thouars y Av. 28 de Julio"],
  ["Santa Catalina y La Victoria Moderna", "La Victoria", "Zona empresarial moderna frente a San Isidro", "Av. Canadá, Av. Javier Prado Este y Av. Nicolás Arriola"],
  ["Gamarra y Balconcillo", "La Victoria", "Emporio comercial de altísimo movimiento", "Av. Aviación, Av. México y Jr. Sebastián Barranca"],
  ["Breña y Av. Venezuela", "Breña", "Clima urbano templado tradicional", "Av. Venezuela, Av. Brasil y Av. Arica"],
  ["Rímac y Alameda de los Descalzos", "Rímac", "Clima tradicional junto al río y Cerro San Cristóbal", "Av. Alcázar, Av. Tarapacá y Jr. Trujillo"],
  ["Pamplona Baja y Ciudad de Dios", "San Juan de Miraflores", "Eje comercial del sur con humedad moderada", "Av. Los Héroes, Av. San Juan y Av. Pedro Miotta"],
  ["Parque Industrial y El Sol", "Villa El Salvador", "Brisa marina del litoral sur", "Av. El Sol, Av. Pachacútec y Av. Revolución"],
  ["José Carlos Mariátegui y Nueva Esperanza", "Villa María del Triunfo", "Neblina invernal de lomas costeras", "Av. Pachacútec, Av. Salvador Allende y Av. Lima"],
  ["Pachacámac y Manchay", "Pachacámac", "Clima soleado y campestre del valle sur", "Av. Paul Poblet, Av. Víctor Malásquez y Plaza de Armas"],
  ["Lurín y Mamacona", "Lurín", "Brisa costera templada y sol de valle", "Antigua Panamericana Sur y Av. San Pedro"],
  ["Punta Hermosa y Pulpos", "Punta Hermosa", "Viento marino, salinidad y sol de playa todo el verano", "Av. García Rada, Malecón Norte y Playa Señoritas"],
  ["San Bartolo y Punta Negra", "San Bartolo", "Ambiente oceánico salino que exige hidratación en crema", "Malecón San Martín y Antigua Panamericana Sur"],
  ["Pucusana y Naplo", "Pucusana", "Bahía costera soleada con brisa marina", "Malecón Rodríguez Larraín y Av. Lima"],
  ["La Punta y Chucuito", "Callao", "Máxima humedad marina (88%) rodeada de mar", "Av. Bolognesi, Malecón Pardo y Plaza Gálvez"],
  ["Bellavista y Mallplaza", "Callao", "Clima costero templado en eje comercial chalaco", "Av. Óscar R. Benavides (Colonial), Av. Faucett y Av. Venezuela"],
  ["La Perla y Costanera Chalaca", "Callao", "Viento directo del Pacífico junto a San Miguel", "Av. Costanera, Av. Santa Rosa y Av. La Paz"],
  ["Carmen de la Legua y Aeropuerto", "Callao", "Zona industrial y aeroportuaria de alto tránsito", "Av. Elmer Faucett, Av. Morales Duárez y Av. Argentina"],
];

// ============================================================================
// SILO 2: 100 DISTRITOS REGIONALES Y CIUDADES INTERMEDIAS DEL PERÚ (100)
// ============================================================================
const PERU_REGIONS = [
  // Arequipa (8)
  ["Yanahuara y Mirador", "Arequipa", "Clima seco andino (2,335 msnm) con alta radiación UV", "Av. Ejército, Plaza de Yanahuara y Calle Misti"],
  ["Cayma y Real Plaza", "Arequipa", "Aire seco de montaña que reseca lociones alcohólicas", "Av. Ejército, Av. Cayma y Calle Trinidad Morán"],
  ["Cerro Colorado y Challapampa", "Arequipa", "Sol intenso los 300 días del año y baja humedad", "Av. Aviación, Vía de Evitamiento y Plaza Las Américas"],
  ["Umacollo y Vallecito", "Arequipa", "Microclima templado-seco residencial", "Av. Parra, Calle San Juan de Dios y Av. Marina"],
  ["José Luis Bustamante y Rivero y Lambramani", "Arequipa", "Clima soleado con tardes frescas y secas", "Av. Lambramani, Av. Dolores y Av. Estados Unidos"],
  ["Paucarpata y Porongoche", "Arequipa", "Radiación solar alta en zona comercial arequipeña", "Av. Porongoche, Av. Jesús y Av. Kennedy"],
  ["Sachaca y Tahuaycani", "Arequipa", "Brisa campestre seca al pie de los volcanes", "Av. Tahuaycani, Av. Fernandini y Mirador de Sachaca"],
  ["Mollendo y Camaná", "Arequipa Costa", "Clima costero del sur con sol de verano y brisa marina", "Malecón Ratti, Plaza Bolognesi y Av. Mariscal Castilla"],
  // La Libertad / Trujillo (8)
  ["Víctor Larco y El Golf de Trujillo", "Trujillo", "Clima primaveral costero con brisa de Huanchaco", "Av. El Golf, Av. Larco y Urb. California"],
  ["Urb. Primavera y San Andrés", "Trujillo", "Templado soleado en zona universitaria y residencial", "Av. Juan Pablo II, Av. América Oeste y Av. Fátima"],
  ["Centro Histórico y Pizarro", "Trujillo", "Clima cálido-templado durante todo el año", "Jr. Pizarro, Plaza de Armas y Av. España"],
  ["Huanchaco y Las Delicias", "Trujillo", "Brisa marina norteña y salinidad costera", "Av. La Rivera, Malecón de Huanchaco y El Boquerón"],
  ["La Esperanza y El Porvenir", "Trujillo", "Sol constante y clima seco-cálido en el norte", "Av. Tahuantinsuyo, Av. Pumacahua y Panamericana Norte"],
  ["Pacasmayo y San Pedro de Lloc", "La Libertad", "Viento marino constante y sol norteño", "Malecón Grau y Calle 2 de Mayo"],
  ["Chepén y Guadalupe", "La Libertad", "Clima cálido agrícola del valle Jequetepeque", "Calle Lima y Panamericana Norte"],
  ["Huamachuco y Otuzco", "La Libertad Sierra", "Clima frío y seco de la sierra liberteña", "Plaza Mayor de Huamachuco y Jr. Bolívar"],
  // Cusco (7)
  ["Wanchaq y Av. De la Cultura", "Cusco", "Clima frío y seco de altura (3,399 msnm)", "Av. De la Cultura, Urb. Santa Mónica y Óvalo Pachacútec"],
  ["San Sebastián y Larapa", "Cusco", "Aire andino seco con fuerte radiación solar diurna", "Av. De la Cultura, Urb. Larapa Grande y Vía Expresa"],
  ["Centro Histórico y San Blas", "Cusco", "Noches heladas que exigen hidratación dérmica en crema", "Av. El Sol, Plaza de Armas y Cuesta de San Blas"],
  ["San Jerónimo y Kayra", "Cusco", "Clima templado-frío en el extremo sur del valle", "Av. Manco Cápac y Plaza de San Jerónimo"],
  ["Valle Sagrado: Urubamba y Pisac", "Cusco", "Microclima templado andino a 2,870 msnm", "Av. Mariscal Castilla y Av. Ferrocarril en Urubamba"],
  ["Sicuani y Canchis", "Cusco", "Frío seco altiplánico a más de 3,500 msnm", "Av. Confederación y Plaza de Armas de Sicuani"],
  ["Quillabamba y La Convención", "Cusco Selva", "Clima cálido y húmedo de ceja de selva", "Plaza de Armas de Quillabamba y Jr. Martín Pío Concha"],
  // Piura y Tumbes (8)
  ["Castilla y Miraflores Piura", "Piura", "Calor intenso (32°C+) y radiación solar norteña", "Av. Guardia Civil, Av. Independencia y Open Plaza"],
  ["Urb. El Chipe y Los Ejidos", "Piura", "Clima cálido y seco que evapora líquidos al instante", "Av. Country, Av. Vice y Av. Fortunato Chirichigno"],
  ["Sullana y La Perla del Chira", "Piura", "Sol tropical y calor constante del valle del Chira", "Av. José de Lama, Calle San Martín y Plaza de Armas"],
  ["Talara y Pariñas", "Piura", "Brisa marina cálida y sol costero todo el año", "Av. Bolognesi y Centro Cívico de Talara"],
  ["Paita y Colán", "Piura", "Viento oceánico y alta radiación solar", "Jr. Junín, Malecón de Paita y Esmeralda de Colán"],
  ["Máncora y Los Órganos", "Piura", "Sol de playa los 365 días, salinidad y calor", "Av. Piura en Máncora y Punta Veleros"],
  ["Sechura y Catacaos", "Piura", "Clima desértico cálido y seco", "Calle Comercio en Catacaos y Plaza de Sechura"],
  ["Zarumilla y Punta Sal", "Tumbes", "Clima tropical ecuatorial cálido y húmedo", "Av. Tumbes, Paseo Libertadores y Balneario Punta Sal"],
  // Lambayeque y Cajamarca (8)
  ["Santa Victoria y Los Parques", "Chiclayo", "Clima cálido-templado con viento constante", "Av. Santa Victoria, Av. Grau y Paseo Las Musas"],
  ["Centro de Chiclayo y Balta", "Chiclayo", "Sol norteño y actividad comercial intensa", "Av. José Balta, Calle Elías Aguirre y Av. Bolognesi"],
  ["Pimentel y San José", "Chiclayo", "Brisa marina fuerte del litoral lambayecano", "Malecón Seoane y Ruta Chiclayo-Pimentel"],
  ["Lambayeque Ciudad Evocadora", "Lambayeque", "Clima cálido y seco en la costa norte", "Av. Huamachuco y Calle 2 de Mayo"],
  ["Ferreñafe y Monsefú", "Lambayeque", "Sol tradicional y viento cálido", "Plaza de Armas de Ferreñafe y Av. Venezuela"],
  ["Los Baños del Inca y El Ingenio", "Cajamarca", "Clima templado-frío andino (2,750 msnm) con aguas termales", "Av. Manco Cápac, Av. Atahualpa y Plaza de Armas"],
  ["Jaén y Bellavista", "Cajamarca Nororiente", "Clima cálido y húmedo de ceja de selva norteña", "Calle Bolívar, Plaza de Armas de Jaén y Av. Pakamuros"],
  ["Chota y Cutervo", "Cajamarca Sierra", "Aire frío de montaña que requiere crema dermo-hidratante", "Plaza de Armas de Chota y Jr. 30 de Agosto"],
  // Junín y Sierra Central (8)
  ["El Tambo y San Carlos", "Huancayo", "Clima seco de altura (3,259 msnm) y sol intenso", "Av. Mariscal Castilla, Av. San Carlos y Calle Real"],
  ["Chilca y Huancayo Centro", "Huancayo", "Heladas nocturnas y aire seco en el Valle del Mantaro", "Calle Real, Av. Giráldez y Av. Huancavelica"],
  ["Jauja y Concepción", "Junín", "Aire puro y seco considerado de los más sanos del país", "Plaza de Armas de Jauja y Jr. Junín"],
  ["Tarma (La Perla de los Andes)", "Junín", "Microclima templado-seco de valle interandino", "Jr. Lima y Av. Pacheco en Tarma"],
  ["La Merced y San Ramón (Chanchamayo)", "Junín Selva Central", "Clima tropical cálido y húmedo", "Av. Carlos Peschiera y Plaza de La Merced"],
  ["Satipo y Mazamari", "Junín Selva", "Calor húmedo amazónico de selva central", "Jr. Colonos Fundadores y Plaza de Satipo"],
  ["Oxapampa y Villa Rica", "Pasco", "Clima templado-húmedo de reserva de biósfera", "Av. San Martín en Oxapampa y Plaza de Villa Rica"],
  ["Cerro de Pasco y Yanacancha", "Pasco", "Clima extremo de gran altitud (4,330 msnm) que exige máxima hidratación", "Av. El Minero y Plaza Chaupimarca"],
  // Áncash y Lima Provincias (10)
  ["Nuevo Chimbote y Buenos Aires", "Áncash", "Clima costero templado y soleado", "Av. Pacífico, Av. Country y Plaza Mayor de Nuevo Chimbote"],
  ["Chimbote Centro y Malecón Grau", "Áncash", "Brisa marina de la bahía El Ferrol", "Av. José Pardo, Av. Gálvez y Malecón Grau"],
  ["Casma y Huarmey", "Áncash Costa", "Valle del eterno sol con clima cálido todo el año", "Av. Bolívar en Casma y Plaza Independencia en Huarmey"],
  ["Carhuaz, Yungay y Caraz", "Áncash Callejón de Huaylas", "Clima seco andino bajo la Cordillera Blanca", "Av. Independencia en Huaraz y Plaza de Caraz"],
  ["Huacho y Santa María", "Lima Provincias", "Clima costero templado en el Norte Chico", "Av. 28 de Julio, Calle Colón y Malecón Roca"],
  ["Barranca y Supe Puerto", "Lima Provincias", "Brisa marina y sol del norte chico", "Jr. Gálvez, Av. Grau y Circuito de Playas de Barranca"],
  ["Huaral y Chancay (Megapuerto)", "Lima Provincias", "Polo logístico e industrial con clima costero húmedo", "Calle Derecha en Huaral y Boulevard López de Zúñiga en Chancay"],
  ["San Vicente de Cañete e Imperial", "Lima Provincias", "Clima soleado y templado del Sur Chico", "Av. Mariscal Benavides y Jr. 2 de Mayo en Imperial"],
  ["Asia, Mala y Chilca", "Lima Provincias", "Balnearios con sol intenso de verano y viento marino", "Boulevard de Asia y Antigua Panamericana Sur"],
  ["Lunahuaná y Valle de Cañete", "Lima Provincias", "Sol permanente y clima seco de valle", "Plaza de Armas de Lunahuaná y Anexo Paullo"],
  // Ica, Ayacucho, Apurímac, Huancavelica (10)
  ["La Tinguiña y Parcona", "Ica", "Clima desértico seco y soleado todo el año", "Av. Los Maestros, Urb. San Isidro y Huacachina"],
  ["Chincha Alta y Sunampe", "Ica", "Clima cálido costero a dos horas de Lima", "Av. Benavides, Calle Santo Domingo y Plaza de Armas de Chincha"],
  ["Pisco y Paracas", "Ica", "Fuertes vientos Paracas y brisa salina", "Plaza de Armas de Pisco y El Chaco en Paracas"],
  ["Nazca y Marcona", "Ica", "Clima árido de alta radiación solar y viento costero", "Calle Lima en Nazca y Puerto de San Juan de Marcona"],
  ["Huamanga y Jesús Nazareno", "Ayacucho", "Clima seco y templado de sierra sur (2,761 msnm)", "Portal Independencia, Jr. 28 de Julio y Av. Mariscal Cáceres"],
  ["Huanta (La Esmeralda de los Andes)", "Ayacucho", "Valle templado y soleado en la sierra ayacuchana", "Parque de los Héroes y Jr. Razuhuillca"],
  ["Abancay y Tamburco", "Apurímac", "Valle de eterna primavera con sol seco", "Av. Díaz Bárcenas, Av. Arenas y Plaza de Armas de Abancay"],
  ["Andahuaylas y San Jerónimo", "Apurímac", "Clima frío y seco del valle del Chumbao", "Av. Perú y Jr. Constitución en Andahuaylas"],
  ["Huancavelica Centro y Ascensión", "Huancavelica", "Frío andino intenso (3,676 msnm) que reseca la piel sin crema", "Av. Celestino Manchego Muñoz y Plaza de Armas"],
  ["Puquio y Coracora", "Ayacucho Sur", "Aire seco de altura en los Andes del sur", "Plaza Mayor de Puquio y Jr. 9 de Diciembre"],
  // Tacna, Moquegua, Puno, Madre de Dios (10)
  ["Gregorio Albarracín y Pocollay", "Tacna", "Clima desértico templado en la frontera sur", "Av. Bolognesi, Av. San Martín y Paseo Cívico"],
  ["Alto de la Alianza y Ciudad Nueva", "Tacna", "Radiación solar alta y aire seco", "Av. Pinto y Mercadillo Bolognesi en Tacna"],
  ["Moquegua Centro y Samegua", "Moquegua", "Uno de los climas más soleados y secos del Perú", "Calle Moquegua, Plaza de Armas y Malecón Ribereño"],
  ["Puerto de Ilo y Pacocha", "Moquegua Costa", "Brisa marina del sur y clima templado todo el año", "Malecón Costero de Ilo y Calle Zepita"],
  ["Juliaca y Salcedo", "Puno", "Viento frío y seco del altiplano (3,825 msnm)", "Jr. Tumbes, Plaza de Armas de Juliaca y Jr. San Román"],
  ["Puno Centro y Lago Titicaca", "Puno", "Radiación UV altísima y frío seco de altura", "Jr. Lima, Parque Pino y Av. La Torre"],
  ["Ilave, Azángaro y Ayaviri", "Puno", "Altiplano andino donde el alcohol líquido quema la piel", "Plaza de Armas de Ayaviri y Jr. Puno"],
  ["Puerto Maldonado y Tambopata", "Madre de Dios", "Clima tropical amazónico de alta temperatura y humedad", "Av. León Velarde y Plaza de Armas de Puerto Maldonado"],
  ["Iberia y Mazuko", "Madre de Dios", "Calor húmedo de la selva sur oriental", "Av. Interoceánica Sur"],
  ["Desaguadero y Yunguyo", "Puno Frontera", "Frío seco lacustre a orillas del Titicaca", "Av. Panamericana y Plaza de Yunguyo"],
  // Amazonía y Nororiente: Loreto, San Martín, Ucayali, Amazonas, Huánuco (13)
  ["Punchana y Belén", "Iquitos (Loreto)", "Calor ecuatorial húmedo los 12 meses del año", "Av. La Marina, Calle Próspero y Plaza 28 de Julio"],
  ["San Juan Bautista y Aeropuerto", "Iquitos (Loreto)", "Clima amazónico donde las cremas ligeras absorben en 3 min", "Av. Abelardo Quiñones y Calle Napo"],
  ["Yurimaguas y Nauta", "Loreto", "Clima cálido tropical en puerto fluvial", "Calle Sargento Lores y Plaza Mayor de Yurimaguas"],
  ["Morales y La Banda de Shilcayo", "Tarapoto (San Martín)", "Clima cálido de selva alta (Ciudad de las Palmeras)", "Jr. Jiménez Pimentel, Jr. Martínez de Compagñón y Morales"],
  ["Moyobamba y Rioja", "San Martín", "Valle del Alto Mayo con clima templado-cálido tropical", "Jr. Pedro Canga en Moyobamba y Plaza de Rioja"],
  ["Juanjuí y Tocache", "San Martín Sur", "Calor tropical del valle del Huallaga Central", "Av. Fernando Belaunde Terry"],
  ["Yarinacocha y Manantay", "Pucallpa (Ucayali)", "Sol amazónico intenso y brisa de la laguna Yarinacocha", "Jr. Tarapacá, Av. Centenario y Puerto Callao"],
  ["Aguaytía y Atalaya", "Ucayali", "Clima cálido húmedo de selva baja", "Plaza Mayor de Aguaytía"],
  ["Amarilis y Pillco Marca", "Huánuco", "Reconocido como el mejor clima templado-seco del mundo", "Jr. General Prado, Jr. 2 de Mayo y Cayhuayna"],
  ["Tingo María (La Bella Durmiente)", "Huánuco Selva", "Clima tropical cálido en puerta de la Amazonía", "Av. Raimondi y Alameda Perú en Tingo María"],
  ["Chachapoyas y Kuelap", "Amazonas", "Clima templado-frío de ceja de selva nubosa", "Jr. Amazonas y Plaza Mayor de Chachapoyas"],
  ["Bagua Grande y Bagua Chica", "Amazonas", "Calor intenso del valle de Utcubamba", "Av. Chachapoyas en Bagua Grande"],
  ["Zarumilla y Aguas Verdes", "Tumbes Frontera", "Sol ecuatorial intenso en frontera norte", "Av. República del Perú"],
  ["Cajabamba y Celendín", "Cajamarca Sur", "Clima templado-seco de sierra norte", "Plaza Mayor de Cajabamba y Jr. Dos de Mayo"],
  ["Bambamarca y Hualgayoc", "Cajamarca Centro", "Aire frío andino que requiere hidratación en crema", "Jr. Alfonso Ugarte y Plaza de Armas de Bambamarca"],
  ["San Ignacio y Chirinos", "Cajamarca Selva Alta", "Microclima templado-cálido cafetalero", "Av. Mariano Melgar y Plaza de San Ignacio"],
  [" Virú y Chao", "La Libertad Costa", "Clima cálido agroindustrial con sol todo el año", "Av. Virú y Panamericana Norte"],
  ["Casa Grande y Chocope (Valle Chicama)", "La Libertad", "Sol constante y viento templado del valle", "Plaza de Casa Grande y Calle Diego de Mora"],
  ["Majes y El Pedregal", "Arequipa Valle", "Sol desértico intenso los 365 días del año", "Av. Colonizadores en El Pedregal"],
  ["Chivay y Valle del Colca", "Arequipa Sierra", "Frío seco de altura (3,635 msnm) y aguas termales", "Plaza de Armas de Chivay y Av. Salaverry"],
  ["Espinar (Yauri) y Chumbivilcas", "Cusco Altoandino", "Viento frío altiplánico a más de 3,900 msnm", "Plaza de Armas de Yauri"],
  ["Pichari y Kimbiri (VRAEM)", "Cusco / Ayacucho Selva", "Clima tropical cálido y húmedo", "Av. La Cultura en Pichari"],
  ["Requena y Contamana", "Loreto Amazonía", "Calor húmedo amazónico junto al río Ucayali", "Malecón Grau en Contamana"],
];

// ============================================================================
// SILO 3: 100 CIUDADES DE EE. UU. (35) Y LATINOAMÉRICA/ESPAÑA (65)
// ============================================================================
const WORLD_CITIES = [
  // USA (35)
  ["Doral (Florida, EE. UU.)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland Signature, Men's Rogaine, Hims, Keeps", "marcas-usa-y-amazon"],
  ["Brickell y Downtown Miami (FL, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Rogaine Foam, Hims, Kirkland, DS Laboratories", "marcas-usa-y-amazon"],
  ["Hialeah y Kendall (Miami, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland 5%, Equate, Rogaine, Keeps", "marcas-usa-y-amazon"],
  ["Orlando y Kissimmee (Florida, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland, Rogaine, Target Up&Up, Hims", "marcas-usa-y-amazon"],
  ["Tampa y St. Petersburg (FL, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Men's Rogaine, Kirkland, Keeps", "marcas-usa-y-amazon"],
  ["Fort Lauderdale y Weston (FL, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Hims, Rogaine Foam, Kirkland Signature", "marcas-usa-y-amazon"],
  ["Queens (Jackson Heights y Astoria, NY)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland, Rogaine, CVS Health, Hims", "marcas-usa-y-amazon"],
  ["Manhattan (Midtown y Upper West Side, NY)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Hims, Keeps, Men's Rogaine, Roman", "marcas-usa-y-amazon"],
  ["Brooklyn y Williamsburg (Nueva York, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Keeps, Hims, Rogaine Foam, Kirkland", "marcas-usa-y-amazon"],
  ["Bronx y Yonkers (Nueva York, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland Signature, Rogaine, Walgreens", "marcas-usa-y-amazon"],
  ["Paterson y Newark (New Jersey, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland 5%, Men's Rogaine, Equate", "marcas-usa-y-amazon"],
  ["Jersey City y Union City (NJ, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Rogaine, Hims, Kirkland Signature", "marcas-usa-y-amazon"],
  ["Los Ángeles (Downtown y Hollywood, CA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Hims, Keeps, Rogaine, Kirkland", "marcas-usa-y-amazon"],
  ["San Diego y Chula Vista (California, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland Signature, Rogaine, Hims", "marcas-usa-y-amazon"],
  ["San Francisco y Bay Area (CA, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Hims, Keeps, Men's Rogaine", "marcas-usa-y-amazon"],
  ["San José y Silicon Valley (CA, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Keeps, Hims, Costco Kirkland", "marcas-usa-y-amazon"],
  ["Sacramento y Fresno (California, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland, Equate, Rogaine", "marcas-usa-y-amazon"],
  ["Anaheim y Orange County (CA, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Men's Rogaine, Kirkland, Hims", "marcas-usa-y-amazon"],
  ["Houston y Katy (Texas, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland Signature, Equate, Rogaine", "marcas-usa-y-amazon"],
  ["Dallas y Fort Worth (Texas, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Men's Rogaine, Hims, Kirkland", "marcas-usa-y-amazon"],
  ["Austin (Texas, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Hims, Keeps, Rogaine Foam", "marcas-usa-y-amazon"],
  ["San Antonio (Texas, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland, Equate Walmart, Rogaine", "marcas-usa-y-amazon"],
  ["El Paso y McAllen (Texas, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland Signature, Rogaine, Foligain", "marcas-usa-y-amazon"],
  ["Chicago (Illinois, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Men's Rogaine, Walgreens Minoxidil, Hims", "marcas-usa-y-amazon"],
  ["Phoenix y Scottsdale (Arizona, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland, Rogaine, Keeps", "marcas-usa-y-amazon"],
  ["Las Vegas y Henderson (Nevada, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Hims, Rogaine Foam, Kirkland", "marcas-usa-y-amazon"],
  ["Atlanta (Georgia, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Men's Rogaine, Keeps, Hims", "marcas-usa-y-amazon"],
  ["Charlotte y Raleigh (North Carolina, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland, Equate, Rogaine", "marcas-usa-y-amazon"],
  ["Washington D.C. y Arlington (VA, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Hims, Keeps, Men's Rogaine", "marcas-usa-y-amazon"],
  ["Boston y Cambridge (Massachusetts, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "CVS Health, Rogaine, Hims", "marcas-usa-y-amazon"],
  ["Filadelfia (Pennsylvania, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Rogaine, Kirkland, Keeps", "marcas-usa-y-amazon"],
  ["Denver y Aurora (Colorado, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Hims, Rogaine Foam, Kirkland", "marcas-usa-y-amazon"],
  ["Seattle y Bellevue (Washington, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Costco Kirkland, Hims, Keeps", "marcas-usa-y-amazon"],
  ["Detroit y Minneapolis (Midwest, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Target Up&Up, Rogaine, Kirkland", "marcas-usa-y-amazon"],
  ["Salt Lake City y Provo (Utah, USA)", "🇺🇸", "FDA (OTC Monograph)", "USD ($)", "Kirkland Signature, Rogaine, Equate", "marcas-usa-y-amazon"],
  // Latinoamérica y España (65)
  ["Polanco, Roma y Condesa (CDMX, México)", "🇲🇽", "COFEPRIS", "MXN ($)", "Folcress, Regaine, Similares, Kirkland", "paises-del-mundo"],
  ["Monterrey y San Pedro Garza García (México)", "🇲🇽", "COFEPRIS", "MXN ($)", "Folcress 5%, Regaine, Choiz, Kirkland", "paises-del-mundo"],
  ["Guadalajara y Zapopan (Jalisco, México)", "🇲🇽", "COFEPRIS", "MXN ($)", "Folcress, Dermanox, Kirkland, Regaine", "paises-del-mundo"],
  ["Cancún y Playa del Carmen (Quintana Roo, México)", "🇲🇽", "COFEPRIS", "MXN ($)", "Regaine, Folcress, Kirkland", "paises-del-mundo"],
  ["Puebla y Cholula (México)", "🇲🇽", "COFEPRIS", "MXN ($)", "Folcress, Similares, Kirkland", "paises-del-mundo"],
  ["Querétaro y León (Bajío, México)", "🇲🇽", "COFEPRIS", "MXN ($)", "Folcress, Regaine, Kirkland", "paises-del-mundo"],
  ["Tijuana y Mexicali (Baja California, México)", "🇲🇽", "COFEPRIS", "MXN ($)", "Kirkland USA, Folcress, Rogaine", "paises-del-mundo"],
  ["Mérida (Yucatán, México)", "🇲🇽", "COFEPRIS", "MXN ($)", "Folcress, Regaine, Similares", "paises-del-mundo"],
  ["Chapinero y Usaquén (Bogotá, Colombia)", "🇨🇴", "INVIMA", "COP ($)", "MK Minoxidil, Regaine, Kirkland", "paises-del-mundo"],
  ["El Poblado y Laureles (Medellín, Colombia)", "🇨🇴", "INVIMA", "COP ($)", "Minoxidil MK, Laproff, Kirkland", "paises-del-mundo"],
  ["Cali y Valle del Cauca (Colombia)", "🇨🇴", "INVIMA", "COP ($)", "MK 5%, Genfar, Kirkland", "paises-del-mundo"],
  ["Barranquilla (Atlántico, Colombia)", "🇨🇴", "INVIMA", "COP ($)", "Minoxidil MK, Regaine, Kirkland", "paises-del-mundo"],
  ["Cartagena de Indias (Colombia)", "🇨🇴", "INVIMA", "COP ($)", "MK, Laproff, Kirkland", "paises-del-mundo"],
  ["Bucaramanga y Pereira (Colombia)", "🇨🇴", "INVIMA", "COP ($)", "Minoxidil MK, Genfar, Kirkland", "paises-del-mundo"],
  ["Las Condes y Providencia (Santiago, Chile)", "🇨🇱", "ISP Chile", "CLP ($)", "Alopek, Tricoplus, Folipil, Kirkland", "paises-del-mundo"],
  ["Viña del Mar y Valparaíso (Chile)", "🇨🇱", "ISP Chile", "CLP ($)", "Alopek 5%, Tricoplus, Kirkland", "paises-del-mundo"],
  ["Concepción y Talcahuano (Chile)", "🇨🇱", "ISP Chile", "CLP ($)", "Alopek, Folipil, Regaine", "paises-del-mundo"],
  ["Antofagasta e Iquique (Norte de Chile)", "🇨🇱", "ISP Chile", "CLP ($)", "Alopek, Tricoplus, Kirkland", "paises-del-mundo"],
  ["Temuco y Puerto Montt (Sur de Chile)", "🇨🇱", "ISP Chile", "CLP ($)", "Alopek, Folipil", "paises-del-mundo"],
  ["Palermo y Belgrano (Buenos Aires, Argentina)", "🇦🇷", "ANMAT", "ARS ($)", "Ylox, Tricolocion, Capilatis, Neoxidil", "paises-del-mundo"],
  ["Córdoba Capital (Argentina)", "🇦🇷", "ANMAT", "ARS ($)", "Ylox 5%, Neoxidil, Tricolocion", "paises-del-mundo"],
  ["Rosario (Santa Fe, Argentina)", "🇦🇷", "ANMAT", "ARS ($)", "Ylox, Capilatis, Neoxidil", "paises-del-mundo"],
  ["Mendoza Capital (Argentina)", "🇦🇷", "ANMAT", "ARS ($)", "Ylox 5%, Tricolocion", "paises-del-mundo"],
  ["La Plata y Mar del Plata (Argentina)", "🇦🇷", "ANMAT", "ARS ($)", "Ylox, Neoxidil", "paises-del-mundo"],
  ["Barrio de Salamanca y Chamberí (Madrid, España)", "🇪🇸", "AEMPS", "EUR (€)", "Viñas, Lacovin, Regaxidil, Normopil", "paises-del-mundo"],
  ["Eixample y Gràcia (Barcelona, España)", "🇪🇸", "AEMPS", "EUR (€)", "Lacovin 5%, Viñas, Regaxidil", "paises-del-mundo"],
  ["Valencia y Alicante (España)", "🇪🇸", "AEMPS", "EUR (€)", "Lacovin, Viñas, Normopil", "paises-del-mundo"],
  ["Sevilla y Málaga (Andalucía, España)", "🇪🇸", "AEMPS", "EUR (€)", "Regaxidil, Lacovin, Viñas", "paises-del-mundo"],
  ["Bilbao y San Sebastián (País Vasco, España)", "🇪🇸", "AEMPS", "EUR (€)", "Viñas 5%, Lacovin, Regaxidil", "paises-del-mundo"],
  ["Zaragoza y Palma de Mallorca (España)", "🇪🇸", "AEMPS", "EUR (€)", "Lacovin, Regaxidil", "paises-del-mundo"],
  ["Quito (La Carolina y Cumbayá, Ecuador)", "🇪🇨", "ARCSA", "USD ($)", "Minoxiten, Kirkland, Regaine", "paises-del-mundo"],
  ["Guayaquil y Samborondón (Ecuador)", "🇪🇨", "ARCSA", "USD ($)", "Minoxiten, Kirkland Signature", "paises-del-mundo"],
  ["Cuenca (Azuay, Ecuador)", "🇪🇨", "ARCSA", "USD ($)", "Minoxiten, Kirkland", "paises-del-mundo"],
  ["Santa Cruz de la Sierra (Equipetrol, Bolivia)", "🇧🇴", "AGEMED", "BOB (Bs)", "Minoxidil INTI, Kirkland, Foligain", "paises-del-mundo"],
  ["La Paz y Zona Sur Calacoto (Bolivia)", "🇧🇴", "AGEMED", "BOB (Bs)", "Minoxidil INTI, Kirkland", "paises-del-mundo"],
  ["Cochabamba (Bolivia)", "🇧🇴", "AGEMED", "BOB (Bs)", "Minoxidil INTI, Kirkland", "paises-del-mundo"],
  ["San José y Escazú (Costa Rica)", "🇨🇷", "Ministerio de Salud CR", "CRC (₡)", "Regaine, Kirkland, Foligain", "paises-del-mundo"],
  ["Ciudad de Panamá (Punta Pacífica y Obarrio)", "🇵🇦", "MINSA Panamá", "USD ($)", "Rogaine, Kirkland Signature, Hims", "paises-del-mundo"],
  ["Montevideo (Pocitos y Punta Carretas, Uruguay)", "🇺🇾", "MSP Uruguay", "UYU ($U)", "Alopex, Ylox, Regaine", "paises-del-mundo"],
  ["Asunción (Villa Morra, Paraguay)", "🇵🇾", "DINAVISA", "PYG (₲)", "Minoxil, Kirkland, Pant", "paises-del-mundo"],
  ["Santo Domingo (Piantini y Naco, Rep. Dominicana)", "🇩🇴", "DIGEMAPS", "DOP (RD$)", "Kirkland, Rogaine, Foligain", "paises-del-mundo"],
  ["San Juan y Guaynabo (Puerto Rico)", "🇵🇷", "FDA", "USD ($)", "Men's Rogaine, Kirkland, Hims", "paises-del-mundo"],
  ["Ciudad de Guatemala (Zona 10 y Zona 14)", "🇬🇹", "MSPAS", "GTQ (Q)", "Kirkland, Regaine, Folcress", "paises-del-mundo"],
  ["San Salvador (Escalón y Santa Tecla, El Salvador)", "🇸🇻", "DNM", "USD ($)", "Kirkland, Rogaine, Folcress", "paises-del-mundo"],
  ["Tegucigalpa y San Pedro Sula (Honduras)", "🇭🇳", "ARSA", "HNL (L)", "Kirkland, Regaine", "paises-del-mundo"],
  ["Managua (Nicaragua)", "🇳🇮", "MINSA", "NIO (C$)", "Kirkland, Folcress", "paises-del-mundo"],
  ["Caracas (Chacao y Las Mercedes, Venezuela)", "🇻🇪", "MPPS / INHRR", "USD / VES", "Minoxol, Kirkland, MK", "paises-del-mundo"],
  ["São Paulo (Jardins y Paulista, Brasil)", "🇧🇷", "ANVISA", "BRL (R$)", "Pant, Aloxidil, Manual, Kirkland", "paises-del-mundo"],
  ["Río de Janeiro (Ipanema y Barra, Brasil)", "🇧🇷", "ANVISA", "BRL (R$)", "Pant 5%, Aloxidil, Manual", "paises-del-mundo"],
  ["Lisboa y Oporto (Portugal)", "🇵🇹", "INFARMED", "EUR (€)", "Regaine, Tricovivax, Biorga", "paises-del-mundo"],
  ["Milán y Roma (Italia)", "🇮🇹", "AIFA", "EUR (€)", "Carexidil, Biorga, Regaine", "paises-del-mundo"],
  ["París y Lyon (Francia)", "🇫🇷", "ANSM", "EUR (€)", "Bailleul, Alopexy, Sandoz", "paises-del-mundo"],
  ["Berlín y Múnich (Alemania)", "🇩🇪", "BfArM", "EUR (€)", "Regaine Männer, Doppelherz, Alopexy", "paises-del-mundo"],
  ["Londres y Mánchester (Reino Unido)", "🇬🇧", "MHRA", "GBP (£)", "Regaine for Men, Sons, Manual, Numan", "paises-del-mundo"],
  ["Toronto y Vancouver (Canadá)", "🇨🇦", "Health Canada (DIN)", "CAD ($)", "Rogaine, Kirkland Signature, Essential Clinic", "paises-del-mundo"],
  ["Sídney y Melbourne (Australia)", "🇦🇺", "TGA Australia", "AUD ($)", "Regaine, Wagner, Pilot, Mosh", "paises-del-mundo"],
  ["Ámsterdam y Róterdam (Países Bajos)", "🇳🇱", "CBG-MEB", "EUR (€)", "Linn Minoxidil, Regaine", "paises-del-mundo"],
  ["Zúrich y Ginebra (Suiza)", "🇨🇭", "Swissmedic", "CHF", "Alopexy, Regaine, Neoptide", "paises-del-mundo"],
  ["Bruselas y Amberes (Bélgica)", "🇧🇪", "FAMHP", "EUR (€)", "Minoxidil Biorga, Regaine", "paises-del-mundo"],
  ["Estocolmo y Oslo (Escandinavia)", "🇸🇪", "Läkemedelsverket", "SEK / NOK", "Recrea Forte, Orifarm, Regaine", "paises-del-mundo"],
  ["Tokio y Osaka (Japón)", "🇯🇵", "PMDA Japón", "JPY (¥)", "RiUP X5 Plus (Taisho), Scalp D", "paises-del-mundo"],
  ["Seúl (Corea del Sur)", "🇰🇷", "MFDS Corea", "KRW (₩)", "Minoxyl (Hyundai Pharm), 판시딜", "paises-del-mundo"],
  ["Dubái y Abu Dabi (Emiratos Árabes Unidos)", "🇦🇪", "MOHAP / DHA", "AED", "Regaine, Hairgrow, Kirkland", "paises-del-mundo"],
  ["Tel Aviv y Jerusalén (Israel)", "🇮🇱", "Ministry of Health IL", "ILS (₪)", "Minoxi 5, Regaine", "paises-del-mundo"],
  ["Singapur y Kuala Lumpur (Sudeste Asiático)", "🇸🇬", "HSA Singapur", "SGD ($)", "Regaine Foam, Growell, Sons", "paises-del-mundo"],
];

// ============================================================================
// SILO 4: 100 COMBINACIONES CORTE × BARBA × TIPO DE ROSTRO (100)
// ============================================================================
const CUT_STYLES = [
  "Low Fade (Degradado Bajo)",
  "Mid Fade (Degradado Medio)",
  "High Skin Fade (Degradado Alto a Piel)",
  "Taper Fade Clásico",
  "Buzz Cut (Rapado Militar #1 o #2)",
  "French Crop Texturizado",
  "Pompadour Ejecutivo",
  "Slick Back (Peinado Hacia Atrás)",
  "Mullet Moderno (Burst Fade)",
  "Corte Clásico a Tijera (Old Money)",
];

const BEARD_STYLES = [
  "Barba Corporativa Cerrada (Boxed Beard)",
  "Barba Candado (Goatee / Balbo)",
  "Barba de 3 Días (Heavy Stubble)",
  "Barba con Degradado Lateral (Beard Fade)",
  "Barba Van Dyke (Bigote y Mentón en Punta)",
  "Barba Vikinga / Leñador (Garibaldi)",
  "Barba Italiana Perfilada a Navaja",
  "Bigote Chevron + Sombra de Barba (Beardstache)",
  "Barba Ancla (Anchor Beard) para Estilizar",
  "Barba Corta Ejecutiva con Línea Alta en Pómulo",
];

const FACE_SHAPES = [
  "Rostro Redondo",
  "Rostro Cuadrado",
  "Rostro Ovalado",
  "Rostro Alargado",
  "Rostro Diamante",
];

const SILO_4_ITEMS = [];
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    const cut = CUT_STYLES[i];
    const beard = BEARD_STYLES[j];
    const face = FACE_SHAPES[(i + j) % FACE_SHAPES.length];
    SILO_4_ITEMS.push({ cut, beard, face });
  }
}

// ============================================================================
// SILO 5: 90 CASOS POR EDAD, GENÉTICA Y BIOTIPO CUTÁNEO (90)
// ============================================================================
const AGE_BRACKETS = [
  "a los 18 y 20 Años (Primeros Folículos)",
  "a los 22 y 24 Años (Juventud Universitaria)",
  "a los 25 y 28 Años (Etapa de Máxima Respuesta)",
  "a los 30 y 34 Años (Consolidación Ejecutiva)",
  "a los 35 y 39 Años (Madurez Folicular)",
  "a los 40 y 44 Años (Densidad y Entradas)",
  "a los 45 y 49 Años (Barba Entrecana)",
  "a los 50 y 55 Años (Rejuvenecimiento Facial)",
  "después de los 60 Años (Mantenimiento Dermo-Hidratante)",
];

const SKIN_GENETIC_CASES = [
  "sin Genética Familiar de Barba (Rostro Lampiño)",
  "con Piel Grasa y Tendencia al Acné",
  "con Piel Seca y Sensible al Alcohol",
  "para Cerrar Huecos en las Mejillas Laterales",
  "para Conectar el Bigote con el Candado",
  "para Poblar la Zona Bajo el Labio Inferior (Soul Patch)",
  "con Crecimiento Asimétrico (Lado Izquierdo vs. Derecho)",
  "con Vello Rubio, Pelirrojo o Castaño Claro",
  "con Remolinos Rebeldes en el Cuello y Mentón",
  "trabajando en Oficinas con Aire Acondicionado Todo el Día",
];

const SILO_5_ITEMS = [];
for (const age of AGE_BRACKETS) {
  for (const sc of SKIN_GENETIC_CASES) {
    SILO_5_ITEMS.push({ age, sc });
  }
}

// ============================================================================
// SILO 6: 90 SITUACIONES REALES DE ESTILO DE VIDA (PEOPLE ALSO ASK) (90)
// ============================================================================
const LIFESTYLE_SITUATIONS = [
  "Olvidar una Aplicación de Minoxidil por la Mañana",
  "Sudar en el Gimnasio o Hacer CrossFit Después de Aplicar Minoxidil",
  "Salir a Correr (Running) o Jugar Fútbol al Aire Libre",
  "Nadar en Piscina con Cloro Durante tu Tratamiento de Barba",
  "Ir a la Playa y Exponerse al Agua de Mar y Sol en Verano",
  "Usar Casco de Moto Cerrado Todos los Días y Cuidar la Barba",
  "Usar Bloqueador Solar Facial (SPF 50+) Junto con You Minox en Crema",
  "Aplicar Crema Hidratante o Sérum Facial Después de You Minox",
  "Viajar en Avión con tu Tubo de You Minox de 60 g en Equipaje de Mano",
  "Dormir Boca Abajo o de Lado sin Manchar la Almohada por la Noche",
  "Tener Mascotas (Perros o Gatos) en Casa: Precauciones de Higiene y Lavado de Manos",
  "Estar en Contacto con tu Pareja o Hijos Después de Aplicar la Crema",
  "Trabajar en Turnos Nocturnos o Rotativos y Ajustar el Horario cada 12 Horas",
  "Usar Mascarilla Quirúrgica o Industrial en el Trabajo sin Irritar la Barba",
  "Afeitarse por Exigencia Laboral o Militar Mientras Usas Minoxidil",
  "Pasar de un Clima Costero Húmedo a la Sierra Seca en un Viaje de Trabajo",
  "Experimentar el Efecto Shedding en el Mes 2 o Mes 3 sin Abandonar",
  "Estancamiento en el Mes 4 (Plateau): Cómo Reactivar los Folículos",
  "Cómo Dejar el Minoxidil Gradualmente (Weaning Off) en el Mes 12",
  "Diferencia entre Vello Velloso, Vello Transicional y Vello Terminal Definitivo",
  "Por Qué los Vellos del Mentón Crecen Más Rápido que los de las Mejillas",
  "Cómo Aplicar You Minox Si Ya Tienes la Barba de 2 o 3 Centímetros de Largo",
  "Lavar el Rostro con Agua Fría vs. Agua Tibia Antes de Aplicar You Minox",
  "Usar Sauna o Baño Turco de Vapor en el Club o Gimnasio",
  "Exponerse al Frío Extremo o Viento Helado Después de la Aplicación",
  "Tomar Café o Pre-Entrenos con Cafeína Mientras Usas Minoxidil Tópico",
  "Consumo Moderado de Alcohol en Fines de Semana y su Impacto en la Hidratación",
  "Cómo Limpiar el Dosificador y Conservar tu Tubo de You Minox a Temperatura Ambiente",
  "Cuánto Dura Exactamente un Tubo de 60 g de You Minox Aplicando en Barba",
  "Cuánto Dura un Tubo de 60 g Si lo Aplicas en Barba y Entradas al Mismo Tiempo",
];

const LIFESTYLE_ANGLES = [
  "Protocolo Clínico Paso a Paso",
  "Recomendaciones de Maestros Barberos y Dermatólogos",
  "Errores que Debes Evitar para No Perder Progreso",
];

const SILO_6_ITEMS = [];
for (const sit of LIFESTYLE_SITUATIONS) {
  for (const ang of LIFESTYLE_ANGLES) {
    SILO_6_ITEMS.push({ sit, ang });
  }
}

// ============================================================================
// SILO 7: 80 TRICOLOGÍA, ESCALA NORWOOD 1-7 Y ALOPECIA CAPILAR (80)
// ============================================================================
const ALOPECIA_TOPICS = [
  "Escala Norwood Grado 1: Línea de Madurez vs. Inicio de Alopecia",
  "Escala Norwood Grado 2: Cómo Poblar las Entradas Iniciales con Crema",
  "Escala Norwood Grado 2A: Retroceso Frontal Uniforme en Hombres Jóvenes",
  "Escala Norwood Grado 3: Entradas Profundas en Forma de M o U",
  "Escala Norwood Grado 3 Vertex: Primeros Claros en el Remolino de la Coronilla",
  "Escala Norwood Grado 4: Puente Fronto-Temporal y Coronilla",
  "Escala Norwood Grado 5: Tratamiento Combinado para Conservar Densidad",
  "Escala Norwood Grado 6 y 7: Cuidado del Cuero Cabelludo y Barba Compensatoria",
  "Alopecia Areata en la Barba (Placa Única en el Mentón o Mejilla)",
  "Alopecia Areata Multifocal: Cómo Recuperar el Vello en Parches",
  "Efluvio Telógeno Agudo por Estrés Laboral o Emocional",
  "Efluvio Telógeno Post-Infección o Post-Operatorios",
  "Alopecia Difusa Masculina (DUPA y DPA): Diagnóstico y Estimulación",
  "Alopecia por Tracción por Uso Diario de Gorras o Cascos Ajustados",
  "Miniaturización Folicular en las Sienes (Triángulos Temporales)",
  "Recuperación Post-Trasplante Capilar FUE con Minoxidil en Crema",
  "Escala Ludwig Grado 1 en Mujeres: Ensanchamiento de la Raya Central",
  "Alopecia Androgenética Femenina: Aplicación Limpia en Crema sin Engrasar",
  "Caída Estacional del Cabello en Otoño e Invierno: Mito o Realidad",
  "Cómo Distinguir un Remolino Natural en la Coronilla de un Inicio de Calvicie",
];

const ALOPECIA_MODIFIERS = [
  "Diagnóstico y Tratamiento con You Minox 5%",
  "Tiempos de Recuperación Mes a Mes",
  "Sinergia con Bloqueadores DHT y Nutrición",
  "Qué Corte de Cabello Pedir en la Barbería",
];

const SILO_7_ITEMS = [];
for (const top of ALOPECIA_TOPICS) {
  for (const mod of ALOPECIA_MODIFIERS) {
    SILO_7_ITEMS.push({ top, mod });
  }
}

// ============================================================================
// SILO 8: 80 DUELOS DIRECTOS 1 VS 1 (ACTIVOS, MARCAS Y FORMATOS) (80)
// ============================================================================
const COMPARISON_RIVALS = [
  "Aceite Esencial de Romero al 5%",
  "Aceite de Ricino Negro Jamaicano (Castor Oil)",
  "Aceite de Menta Piperita (Peppermint Oil)",
  "Capilia Longa (Péptidos de Cúrcuma)",
  "Redensyl 3% + Procapil + Baicapil",
  "Aminexil Clínico en Ampollas",
  "Nanoxidil Tópico en Loción",
  "Stemoxydine al 5% Capilar",
  "Minoxidil Oral en Comprimidos (Loniten / Magistral)",
  "Minoxidil al 2% Tradicional de Farmacia",
  "Minoxidil al 10% y 15% (Por Qué Más Concentración No es Mejor)",
  "Loción Magistral de Botica sin Registro Industrial",
  "Kirkland Signature Líquido con Propilenglicol",
  "Men's Rogaine Foam en Aerosol",
  "Hims Topical Solution 5% (EE. UU.)",
  "Keeps Foam & Liquid 5% (EE. UU.)",
  "Foligain Low Alcohol Formula",
  "Equate Minoxidil (Walmart USA)",
  "Sérums Cosméticos de Barba de Supermercado",
  "Bálsamos de Cera de Abeja y Manteca de Karité",
];

const COMPARISON_CRITERIA = [
  "Absorción Folicular y Resultados a 6 Meses",
  "Tolerancia en Piel Sensible y Cero Caspa de Barba",
  "Relación Costo-Beneficio y Rendimiento por Gramo",
  "Seguridad Dermatológica y Registro Sanitario DIGEMID",
];

const SILO_8_ITEMS = [];
for (const riv of COMPARISON_RIVALS) {
  for (const crit of COMPARISON_CRITERIA) {
    SILO_8_ITEMS.push({ riv, crit });
  }
}

// ============================================================================
// SILO 9: 70 SKINCARE MASCULINO, FOLICULITIS Y CEJAS (70)
// ============================================================================
const SKINCARE_TOPICS = [
  "Cómo Poblar la Cola de la Ceja (Tercio Externo) con Precisión",
  "Cejas Depiladas en Exceso: Recuperación Completa con Crema",
  "Cómo Cubrir una Cicatriz en la Ceja o en la Barba",
  "Pseudofoliculitis de la Barba (Vellos Encarnados en el Cuello)",
  "Dermatitis de Contacto por Propilenglicol: Cómo Sanar tu Piel",
  "Dermatitis Seborreica en Bigote, Cejas y Entrecejo",
  "Piel con Rosácea oTendencia al Enrojecimiento Facial",
  "Cómo Combinar Niacinamida al 10% con You Minox en Crema-Gel",
  "Uso de Ácido Hialurónico y Pantenol en tu Rutina de Barba",
  "Limpiadores Syndet (pH 5.5) vs. Jabón en Barra Tradicional",
  "Exfoliación Suave Semanal para Desobstruir Poros Faciales",
  "Cómo Evitar los Puntos Negros y Comedones Bajo la Barba",
  "Cuidado del Contorno de Ojos al Aplicar Tratamiento en Cejas",
  "Hidratación de Labios y Bigote sin Escurrimiento Amargo",
];

const SKINCARE_ANGLES = [
  "Guía Dermatológica para Hombres",
  "Paso a Paso de Aplicación Segura",
  "Protocolo antes y después de la Barbería",
  "Mitos y Verdades Clínicas",
  "Soluciones Rápidas sin Irritación",
];

const SILO_9_ITEMS = [];
for (const sk of SKINCARE_TOPICS) {
  for (const ang of SKINCARE_ANGLES) {
    SILO_9_ITEMS.push({ sk, ang });
  }
}

// ============================================================================
// SILO 10: 60 NUTRICIÓN FOLICULAR, BIOTINA, MINERALES Y HÁBITOS (60)
// ============================================================================
const NUTRITION_TOPICS = [
  "Biotina 10,000 mcg vs. 5,000 mcg para Engrosar la Barba",
  "Gluconato y Picolinato de Zinc en la Síntesis de Queratina",
  "Vitamina D3 y Receptores del Folículo Piloso",
  "Niveles de Ferritina y Hierro en la Salud Capilar",
  "L-Cisteína y L-Metionina: Aminoácidos Azufrados Clave",
  "Colágeno Hidrolizado + Vitamina C para la Matriz Dérmica",
  "Alimentos Peruanos Ricos en Biotina (Palta, Huevos, Quinua y Pescado)",
  "Sueño Profundo (7–8 Horas) y Producción Natural de Testosterona",
  "Entrenamiento de Fuerza (Pesas) y Circulación Folicular",
  "Impacto del Tabaco y la Nicotina en la Vasoconstricción Capilar",
  "Hidratación Diaria (2.5 Litros de Agua) y Elasticidad Cutánea",
  "Control del Cortisol y Estrés Crónico para Frenar la Caída",
];

const NUTRITION_ANGLES = [
  "Sinergia con You Minox al 5% en Crema-Gel",
  "Dosis Recomendada y Horarios Ideales",
  "Resultados en Grosor y Brillo de la Barba",
  "Evidencia Científica y Consejos Prácticos",
  "Plan de 90 Días para Máxima Densidad",
];

const SILO_10_ITEMS = [];
for (const nut of NUTRITION_TOPICS) {
  for (const ang of NUTRITION_ANGLES) {
    SILO_10_ITEMS.push({ nut, ang });
  }
}

// ============================================================================
// SILO 11: 60 EQUIPAMIENTO DE BARBERÍA Y HERRAMIENTAS (60)
// ============================================================================
const BARBER_TOOLS = [
  "Máquinas Clipper Profesionales (Wahl, BabylissPRO, JRL y StyleCraft)",
  "Trimmers de Precisión para Marcar Líneas en Pómulos y Cuello",
  "Shavers de Lámina de Titanio Hipoalergénica para Degradados a Piel",
  "Navajas Porta-Filo (Shavettes) y Cuchillas de Acero Inoxidable",
  "Cepillo de Cerdas de Jabalí 100% Naturales para Educar la Barba",
  "Peines de Madera de Sándalo y Fibra de Carbono Anti-Estática",
  "Vaporizador Facial de Ozono y Calentador de Toallas en Barbería",
  "Tijeras de Filo Dulce y Microdentadas para Recortar el Bigote",
  "Dermaroller de Titanio 0.5 mm (192 Agujas Reales vs. Discos)",
  "Loción Aftershave sin Alcohol vs. Emulsión Calmante Post-Afeitado",
  "Capa de Barbería, Papel Cuello y Desinfección con Amonio Cuaternario",
  "Iluminación LED Aro y Sillón Hidráulico Reclinable para Visagismo",
];

const TOOL_ANGLES = [
  "Guía de Uso Profesional en Barberías del Perú",
  "Cómo Usarlo en Casa sin Dañar tus Folículos Nuevos",
  "Mantenimiento, Desinfección y Durabilidad",
  "Compatibilidad con el Tratamiento de You Minox en Crema",
  "Consejos de los Mejores Barberos de GuíaDeBarberías.com",
];

const SILO_11_ITEMS = [];
for (const tool of BARBER_TOOLS) {
  for (const ang of TOOL_ANGLES) {
    SILO_11_ITEMS.push({ tool, ang });
  }
}

// ============================================================================
// SILO 12: 50 BIOSEGURIDAD, BPA Y REGULACIÓN SANITARIA DIGEMID (50)
// ============================================================================
const DIGEMID_TOPICS = [
  "Cómo Verificar la Notificación Sanitaria Obligatoria en el Portal de DIGEMID",
  "Qué es el Certificado BPA (Buenas Prácticas de Almacenamiento) de MINOXIDIL PERU S.A.C.",
  "Resolución Directoral DIGEMID y Código de Establecimiento Farmacéutico N.° 0126912",
  "Peligros del Minoxidil Falsificado, Adulterado o Reenvasado en Marketplaces",
  "Por Qué Comprar en una Droguería Formal (RUC 20610220143) Protege tu Salud",
  "Cómo Identificar el Tubo Original de 60 g de You Minox (Sello, Lote y Vencimiento)",
  "Compra Segura de You Minox en Saga Falabella y Tienda Oficial YouMinox.com",
  "Rol del Químico Farmacéutico Director Técnico en el Control de Calidad Capilar",
  "Normativa Sanitaria de Cosméticos y Dermo-Cosméticos en la Comunidad Andina (CAN)",
  "Protocolos de Bioseguridad y Esterilización Exigidos en Barberías del Perú",
];

const DIGEMID_ANGLES = [
  "Guía Legal y Sanitaria en el Perú",
  "Checklist de Verificación para el Consumidor",
  "Garantía de Pureza y Estabilidad Química",
  "Diferencias Frente al Comercio Informal",
  "Preguntas y Respuestas Oficiales",
];

const SILO_12_ITEMS = [];
for (const dig of DIGEMID_TOPICS) {
  for (const ang of DIGEMID_ANGLES) {
    SILO_12_ITEMS.push({ dig, ang });
  }
}

// Verify total = 1000
const rawItems = [];

// 1. Silo 1 (120)
for (const [zone, dist, climate, avenues] of LIMA_ZONES) {
  rawItems.push({
    silo: 1,
    categorySlug: "distritos-de-lima",
    layoutVariant: "geoperu",
    targetZone: "barba",
    locationName: `${zone} (${dist})`,
    locationRegion: `${dist} • Lima Metropolitana`,
    climateNote: climate,
    avenuesNote: avenues,
    gbTitle: `Barberías y Cuidado de Barba en ${zone} (${dist}): Cortes, Perfilado y You Minox`,
    gbSlug: `barberias-y-cuidado-de-barba-en-${slugify(zone)}-${slugify(dist)}`,
    gbKeyword: `barberias y cuidado de barba en ${zone.toLowerCase()} ${dist.toLowerCase()}`,
    gbAngle: `Guía hiper-local para residentes y oficinas de ${zone} en ${dist}: mejores barberías cerca de ${avenues}, impacto del clima (${climate.toLowerCase()}) y rutina con You Minox al 5% en Crema-Gel.`,
    mbTitle: `Minoxidil y Crecimiento de Barba en ${zone} (${dist}): Guía Climática, DIGEMID y Barberías`,
    mbSlug: `minoxidil-y-crecimiento-de-barba-en-${slugify(zone)}-${slugify(dist)}`,
    mbKeyword: `minoxidil en ${zone.toLowerCase()} ${dist.toLowerCase()}`,
    mbAngle: `Protocolo clínico y envío rápido de You Minox en Crema-Gel (60 g con Registro DIGEMID) en ${zone}, ${dist}: cómo proteger tus folículos frente al clima local (${climate.toLowerCase()}) y dónde perfilar tu barba en ${avenues}.`,
    mbCat: "minoxidil",
    mbCatName: "Minoxidil para Barba y Cabello",
  });
}

// 2. Silo 2 (100)
for (const [loc, reg, climate, avenues] of PERU_REGIONS) {
  rawItems.push({
    silo: 2,
    categorySlug: "ciudades-del-peru",
    layoutVariant: "geoperu",
    targetZone: "barba",
    locationName: `${loc} (${reg})`,
    locationRegion: `Región ${reg} • Perú`,
    climateNote: climate,
    avenuesNote: avenues,
    gbTitle: `Mejores Barberías y Perfilado de Barba en ${loc} (${reg}): Precios y Cuidado con You Minox`,
    gbSlug: `mejores-barberias-y-perfilado-de-barba-en-${slugify(loc)}-${slugify(reg)}`,
    gbKeyword: `barberias y barba en ${loc.toLowerCase()} ${reg.toLowerCase()}`,
    gbAngle: `Directorio y guía de estilo en ${loc} (${reg}): dónde cortarse el cabello y perfilar la barba en ${avenues}, adaptación al clima regional (${climate.toLowerCase()}) y cuidado post-navaja con You Minox en Crema-Gel.`,
    mbTitle: `Tratamiento de Barba y Minoxidil en ${loc} (${reg}): Clima Regional, Envío DIGEMID y Barberías`,
    mbSlug: `tratamiento-barba-y-minoxidil-en-${slugify(loc)}-${slugify(reg)}`,
    mbKeyword: `minoxidil y barba en ${loc.toLowerCase()} ${reg.toLowerCase()}`,
    mbAngle: `Guía dermo-folicular para usuarios de ${loc} (${reg}): cómo evitar la resequedad del clima local (${climate.toLowerCase()}) usando You Minox al 5% en Crema-Gel con envío nacional y top barberías en ${avenues}.`,
    mbCat: "minoxidil",
    mbCatName: "Minoxidil para Barba y Cabello",
  });
}

// 3. Silo 3 (100)
for (const [city, flag, reg, curr, brands, catSlug] of WORLD_CITIES) {
  rawItems.push({
    silo: 3,
    categorySlug: catSlug,
    layoutVariant: "geomundo",
    targetZone: "comparativa",
    locationName: city,
    flag,
    regulator: reg,
    currency: curr,
    localBrands: brands,
    gbTitle: `Barberías, Cortes Fade y Cuidado de Barba en ${city} ${flag}: Guía y Comparativa`,
    gbSlug: `barberias-cortes-fade-y-cuidado-de-barba-en-${slugify(city)}`,
    gbKeyword: `barberias y cuidado de barba en ${city.toLowerCase()}`,
    gbAngle: `Observatorio de barbería y grooming masculino en ${city} (${flag}): estilos de corte y barba más pedidos, normativa ${reg} (${curr}) y comparativa de ${brands} frente a You Minox en Crema-Gel.`,
    mbTitle: `Minoxidil para Barba y Cabello en ${city} ${flag}: Regulación ${reg}, Marcas y Comparativa`,
    mbSlug: `minoxidil-para-barba-y-cabello-en-${slugify(city)}-comparativa`,
    mbKeyword: `minoxidil en ${city.toLowerCase()}`,
    mbAngle: `Análisis clínico del mercado de estimulación folicular en ${city} (${flag}) bajo supervisión de ${reg}: evaluación de ${brands} en ${curr} frente a la innovación peruana en Crema-Gel de You Minox.`,
    mbCat: "minoxidil",
    mbCatName: "Minoxidil para Barba y Cabello",
  });
}

// 4. Silo 4 (100)
for (const { cut, beard, face } of SILO_4_ITEMS) {
  rawItems.push({
    silo: 4,
    categorySlug: "barberias-y-estilo-peru",
    layoutVariant: "barberia",
    targetZone: "barba",
    gbTitle: `${cut} + ${beard} para ${face}: Cómo Pedirlo en la Barbería y Mantenerlo`,
    gbSlug: `${slugify(cut)}-con-${slugify(beard)}-para-${slugify(face)}`,
    gbKeyword: `${cut.toLowerCase()} con ${beard.toLowerCase()} ${face.toLowerCase()}`,
    gbAngle: `Manual de visagismo profesional para combinar un ${cut} con ${beard} si tienes ${face}: medidas exactas de peine guía, delineado a navaja y cómo poblar las zonas clave con You Minox en Crema-Gel.`,
    mbTitle: `Cómo Lograr una ${beard} con ${cut} en ${face}: Genética, Densidad y You Minox`,
    mbSlug: `como-lograr-${slugify(beard)}-con-${slugify(cut)}-en-${slugify(face)}`,
    mbKeyword: `${beard.toLowerCase()} en ${face.toLowerCase()} con minoxidil`,
    mbAngle: `Guía de diseño facial y estimulación folicular para hombres con ${face} que buscan lucir ${beard} junto a un ${cut}: cómo tupir mejillas y candado con You Minox al 5% en Crema-Gel.`,
    mbCat: "estilo",
    mbCatName: "Estilos y Genética de Barba",
  });
}

// 5. Silo 5 (90)
for (const { age, sc } of SILO_5_ITEMS) {
  rawItems.push({
    silo: 5,
    categorySlug: "minoxidil-para-barba",
    layoutVariant: "timeline",
    targetZone: "barba",
    gbTitle: `Crecimiento y Perfilado de Barba ${age} ${sc}: Cronograma de Barbería`,
    gbSlug: `crecimiento-y-perfilado-de-barba-${slugify(age)}-${slugify(sc)}`,
    gbKeyword: `barba ${age.toLowerCase()} ${sc.toLowerCase()}`,
    gbAngle: `Calendario mes a mes para desarrollar y perfilar la barba ${age} ${sc}: cuándo acudir al barbero, qué peine guía usar y cómo aplicar You Minox al 5% en Crema-Gel sin irritación.`,
    mbTitle: `Minoxidil para Barba ${age} ${sc}: Resultados Mes a Mes con You Minox Crema-Gel`,
    mbSlug: `minoxidil-para-barba-${slugify(age)}-${slugify(sc)}`,
    mbKeyword: `minoxidil barba ${age.toLowerCase()} ${sc.toLowerCase()}`,
    mbAngle: `Dossier clínico de respuesta folicular ${age} ${sc}: tiempos de transición de vello velloso a terminal usando la emulsión dermo-hidratante de 60 g de You Minox con Registro DIGEMID.`,
    mbCat: "minoxidil",
    mbCatName: "Minoxidil para Barba y Cabello",
  });
}

// 6. Silo 6 (90)
for (const { sit, ang } of SILO_6_ITEMS) {
  rawItems.push({
    silo: 6,
    categorySlug: "minoxidil-para-barba",
    layoutVariant: "timeline",
    targetZone: "rutina",
    gbTitle: `${sit}: ${ang} para Cuidar tu Barba y Corte`,
    gbSlug: `${slugify(sit)}-${slugify(ang)}-barberia`,
    gbKeyword: `${sit.toLowerCase()}`,
    gbAngle: `Respuesta práctica de nuestros maestros barberos y especialistas sobre ${sit.toLowerCase()} (${ang.toLowerCase()}), aprovechando la absorción rápida en 3 minutos de You Minox en Crema-Gel.`,
    mbTitle: `${sit} Durante tu Tratamiento con Minoxidil: ${ang}`,
    mbSlug: `${slugify(sit)}-tratamiento-minoxidil-${slugify(ang)}`,
    mbKeyword: `${sit.toLowerCase()} minoxidil`,
    mbAngle: `Guía clínica verificada sobre ${sit.toLowerCase()} (${ang.toLowerCase()}): cómo mantener el 100% de efectividad folicular sin descamación ni goteo gracias a You Minox al 5% en Crema-Gel.`,
    mbCat: "consejos",
    mbCatName: "Cuidado Diario y Consejos de Barba",
  });
}

// 7. Silo 7 (80)
for (const { top, mod } of SILO_7_ITEMS) {
  rawItems.push({
    silo: 7,
    categorySlug: "minoxidil-para-cabello",
    layoutVariant: "clinico",
    targetZone: "cabello",
    gbTitle: `${top}: ${mod} en Barbería y Casa`,
    gbSlug: `${slugify(top)}-${slugify(mod)}-barberia`,
    gbKeyword: `${top.toLowerCase()}`,
    gbAngle: `Cómo abordar ${top.toLowerCase()} combinando un corte de cabello estratégico en barbería con la aplicación localizada sin goteo de You Minox al 5% en Crema-Gel (${mod.toLowerCase()}).`,
    mbTitle: `${top}: ${mod}`,
    mbSlug: `${slugify(top)}-${slugify(mod)}-alopecia`,
    mbKeyword: `${top.toLowerCase()} tratamiento`,
    mbAngle: `Estudio tricológico sobre ${top.toLowerCase()} (${mod.toLowerCase()}): cómo frenar la miniaturización del bulbo capilar con Minoxidil 5% y Oxothiazolidinecarboxylate en crema You Minox.`,
    mbCat: "alopecia",
    mbCatName: "Alopecia y Regeneración Capilar",
  });
}

// 8. Silo 8 (80)
for (const { riv, crit } of SILO_8_ITEMS) {
  rawItems.push({
    silo: 8,
    categorySlug: "rankings-y-comparativas",
    layoutVariant: "comparativa",
    targetZone: "comparativa",
    gbTitle: `You Minox en Crema-Gel vs. ${riv}: ${crit} en Barba y Barbería`,
    gbSlug: `you-minox-crema-vs-${slugify(riv)}-${slugify(crit)}-barberia`,
    gbKeyword: `you minox vs ${riv.toLowerCase()}`,
    gbAngle: `Duelo técnico cara a cara entre You Minox al 5% en Crema-Gel (#1 en Perú) y ${riv} evaluando ${crit.toLowerCase()} antes y después del perfilado en barbería.`,
    mbTitle: `You Minox 5% Crema-Gel vs. ${riv}: Comparativa de ${crit}`,
    mbSlug: `you-minox-5-crema-gel-vs-${slugify(riv)}-${slugify(crit)}`,
    mbKeyword: `comparativa you minox vs ${riv.toLowerCase()}`,
    mbAngle: `Análisis clínico de laboratorio entre You Minox en Crema-Gel (con Oxothiazolidinecarboxylate y Registro DIGEMID) y ${riv} en cuanto a ${crit.toLowerCase()}.`,
    mbCat: "minoxidil",
    mbCatName: "Minoxidil para Barba y Cabello",
  });
}

// 9. Silo 9 (70)
for (const { sk, ang } of SILO_9_ITEMS) {
  rawItems.push({
    silo: 9,
    categorySlug: "minoxidil-para-cejas-y-piel",
    layoutVariant: "clinico",
    targetZone: "cejas",
    gbTitle: `${sk}: ${ang} y Cuidado en Barbería`,
    gbSlug: `${slugify(sk)}-${slugify(ang)}-barberia`,
    gbKeyword: `${sk.toLowerCase()}`,
    gbAngle: `Manual de cuidado dermo-facial sobre ${sk.toLowerCase()} (${ang.toLowerCase()}): por qué el vehículo sin propilenglicol de You Minox en Crema-Gel protege las pieles reactivas y el contorno de cejas.`,
    mbTitle: `${sk}: ${ang} con You Minox en Crema-Gel`,
    mbSlug: `${slugify(sk)}-${slugify(ang)}-piel-sensible`,
    mbKeyword: `${sk.toLowerCase()} minoxidil crema`,
    mbAngle: `Protocolo dermatológico sobre ${sk.toLowerCase()} (${ang.toLowerCase()}): aplicación segura, hidratación de la barrera cutánea y cero descamación blanca con You Minox 60 g.`,
    mbCat: "consejos",
    mbCatName: "Cuidado Diario y Consejos de Barba",
  });
}

// 10. Silo 10 (60)
for (const { nut, ang } of SILO_10_ITEMS) {
  rawItems.push({
    silo: 10,
    categorySlug: "cuidado-barba-y-rutinas",
    layoutVariant: "clinico",
    targetZone: "rutina",
    gbTitle: `${nut}: ${ang} para una Barba Densa de Barbería`,
    gbSlug: `${slugify(nut)}-${slugify(ang)}-barberia`,
    gbKeyword: `${nut.toLowerCase()}`,
    gbAngle: `Cómo potenciar el grosor de tu barba mediante ${nut.toLowerCase()} (${ang.toLowerCase()}) junto a tu rutina tópica de You Minox en Crema-Gel y tus visitas quincenales al barbero.`,
    mbTitle: `${nut}: ${ang}`,
    mbSlug: `${slugify(nut)}-${slugify(ang)}-biotina`,
    mbKeyword: `${nut.toLowerCase()} barba y cabello`,
    mbAngle: `Guía de nutrición folicular y bioquímica capilar sobre ${nut.toLowerCase()} (${ang.toLowerCase()}) para acelerar la síntesis de queratina terminal en barba y cuero cabelludo.`,
    mbCat: "biotina",
    mbCatName: "Biotina y Vitaminas Capilares",
  });
}

// 11. Silo 11 (60)
for (const { tool, ang } of SILO_11_ITEMS) {
  rawItems.push({
    silo: 11,
    categorySlug: "you-minox-crema",
    layoutVariant: "barberia",
    targetZone: "barba",
    gbTitle: `${tool}: ${ang}`,
    gbSlug: `${slugify(tool)}-${slugify(ang)}`,
    gbKeyword: `${tool.toLowerCase()}`,
    gbAngle: `Todo lo que debes saber sobre ${tool.toLowerCase()} (${ang.toLowerCase()}) y por qué un rostro hidratado con You Minox en Crema-Gel sin residuos blancos mejora el desempeño de cada herramienta.`,
    mbTitle: `${tool} en tu Rutina de Barba: ${ang}`,
    mbSlug: `${slugify(tool)}-rutina-barba-${slugify(ang)}`,
    mbKeyword: `${tool.toLowerCase()} para barba`,
    mbAngle: `Guía técnica sobre ${tool.toLowerCase()} (${ang.toLowerCase()}): cómo integrarlo de forma segura durante tu tratamiento de engrosamiento folicular con You Minox al 5%.`,
    mbCat: "estilo",
    mbCatName: "Estilos y Genética de Barba",
  });
}

// 12. Silo 12 (50)
for (const { dig, ang } of SILO_12_ITEMS) {
  rawItems.push({
    silo: 12,
    categorySlug: "regulacion-digemid-peru",
    layoutVariant: "comparativa",
    targetZone: "regulacion",
    gbTitle: `${dig}: ${ang} en Barberías y Cuidado Masculino`,
    gbSlug: `${slugify(dig)}-${slugify(ang)}-barberias`,
    gbKeyword: `${dig.toLowerCase()}`,
    gbAngle: `Transparencia y seguridad sanitaria sobre ${dig.toLowerCase()} (${ang.toLowerCase()}): por qué las mejores barberías del Perú confían en el respaldo legal de MINOXIDIL PERU S.A.C. y You Minox.`,
    mbTitle: `${dig}: ${ang}`,
    mbSlug: `${slugify(dig)}-${slugify(ang)}-digemid`,
    mbKeyword: `${dig.toLowerCase()} peru`,
    mbAngle: `Dossier regulatorio oficial sobre ${dig.toLowerCase()} (${ang.toLowerCase()}): garantía de calidad farmacéutica de You Minox al 5% en Crema-Gel ante DIGEMID en el Perú.`,
    mbCat: "minoxidil",
    mbCatName: "Minoxidil para Barba y Cabello",
  });
}

console.log("Total Phase 2 items generated:", rawItems.length);
if (rawItems.length !== 1000) {
  throw new Error(`Expected 1000 items, got ${rawItems.length}`);
}

// Load existing slugs in guiadebarberias.com and masbarba.net to guarantee 0 collisions
const gbSeed1File = fs.readFileSync("/Users/charlie/Documents/Google Antigravity/guiadebarberias.com/src/data/blog-seeds.ts", "utf8");
const gbSeed1Slugs = new Set([
  "cuando-perfilar-barba-en-barberia-usando-minoxidil",
  "como-pedir-diseno-de-barba-al-barbero-si-tienes-huecos",
  "ritual-toalla-caliente-y-navaja-afecta-absorcion-minoxidil",
  "cortes-de-cabello-para-disimular-entradas-y-coronilla",
  "cuidado-post-barberia-rutina-para-mantener-degradado-y-barba",
  ...[...gbSeed1File.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1])
]);

const mbExistingPosts = JSON.parse(fs.readFileSync("/Users/charlie/Documents/Google Antigravity/masbarba.net/data/posts.json", "utf8"));
const mbSeed1File = fs.readFileSync("/Users/charlie/Documents/Google Antigravity/masbarba.net/src/data/masbarba-seeds.ts", "utf8");
const mbUsedSlugs = new Set([
  ...mbExistingPosts.map(p => p.slug),
  ...[...mbSeed1File.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1])
]);

const gbPhase2Seeds = [];
const mbPhase2Seeds = [];

rawItems.forEach((item, idx) => {
  const gbId = 501 + idx; // 501 to 1500
  const mbId = 20501 + idx; // 20501 to 21500

  let gbSlug = item.gbSlug;
  if (gbSeed1Slugs.has(gbSlug)) gbSlug = `${gbSlug}-${gbId}`;
  gbSeed1Slugs.add(gbSlug);

  let mbSlug = item.mbSlug;
  if (mbUsedSlugs.has(mbSlug)) mbSlug = `${mbSlug}-${mbId}`;
  mbUsedSlugs.add(mbSlug);

  const readTime = `${6 + (idx % 4)} min`;
  const day = String(1 + (idx % 8)).padStart(2, "0");
  const publishedAt = `2026-11-${day}`;

  gbPhase2Seeds.push({
    id: gbId,
    slug: gbSlug,
    title: item.gbTitle,
    categorySlug: item.categorySlug,
    focusKeyword: item.gbKeyword,
    secondaryKeywords: [item.gbKeyword, "you minox crema", "guiadebarberias.com"],
    angleSummary: item.gbAngle,
    targetZone: item.targetZone,
    readTime,
    publishedAt,
    layoutVariant: item.layoutVariant,
    ...(item.locationName ? { locationName: item.locationName } : {}),
    ...(item.locationRegion ? { locationRegion: item.locationRegion } : {}),
    ...(item.climateNote ? { climateNote: item.climateNote } : {}),
    ...(item.avenuesNote ? { avenuesNote: item.avenuesNote } : {}),
    ...(item.flag ? { flag: item.flag } : {}),
    ...(item.regulator ? { regulator: item.regulator } : {}),
    ...(item.currency ? { currency: item.currency } : {}),
    ...(item.localBrands ? { localBrands: item.localBrands } : {}),
  });

  mbPhase2Seeds.push({
    id: mbId,
    slug: mbSlug,
    title: item.mbTitle,
    category: item.mbCat,
    categoryName: item.mbCatName,
    categorySlug: item.categorySlug,
    focusKeyword: item.mbKeyword,
    secondaryKeywords: [item.mbKeyword, "you minox 5% crema", "masbarba.net"],
    angleSummary: item.mbAngle,
    targetZone: item.targetZone,
    readTime,
    publishedAt,
    layoutVariant: item.layoutVariant,
    ...(item.locationName ? { locationName: item.locationName } : {}),
    ...(item.locationRegion ? { locationRegion: item.locationRegion } : {}),
    ...(item.climateNote ? { climateNote: item.climateNote } : {}),
    ...(item.avenuesNote ? { avenuesNote: item.avenuesNote } : {}),
    ...(item.flag ? { flag: item.flag } : {}),
    ...(item.regulator ? { regulator: item.regulator } : {}),
    ...(item.currency ? { currency: item.currency } : {}),
    ...(item.localBrands ? { localBrands: item.localBrands } : {}),
  });
});

// Write guiadebarberias.com/src/data/blog-seeds-phase2.ts
fs.writeFileSync(
  "/Users/charlie/Documents/Google Antigravity/guiadebarberias.com/src/data/blog-seeds-phase2.ts",
  `import type { GBArticleSeed } from "./blog-seeds";\n\n/**\n * Fase 2: 1,000 semillas de artículos SEO adicionales (IDs 501 al 1500)\n * distribuidas en 12 silos Long-Tail con 0% de canibalización.\n */\nexport const PHASE2_GB_SEEDS: GBArticleSeed[] = ${JSON.stringify(gbPhase2Seeds, null, 2)};\n`,
  "utf8"
);

// Write masbarba.net/src/data/masbarba-seeds-phase2.ts
fs.writeFileSync(
  "/Users/charlie/Documents/Google Antigravity/masbarba.net/src/data/masbarba-seeds-phase2.ts",
  `import type { MasBarbaSeed } from "./masbarba-seeds";\n\n/**\n * Fase 2: 1,000 semillas de artículos SEO adicionales (IDs 20501 al 21500)\n * distribuidas en 12 silos Long-Tail con 0% de canibalización.\n */\nexport const MASBARBA_PHASE2_SEEDS: MasBarbaSeed[] = ${JSON.stringify(mbPhase2Seeds, null, 2)};\n`,
  "utf8"
);

console.log("Successfully wrote 1,000 Phase 2 seeds to both guiadebarberias.com and masbarba.net!");
