
let checks = [
  {
    title:'Routine Dental Care Recomended/Se recomienda Atencion Dental de Rutina',
    options:{
      A:'Dental Cleaning recomended/Se recomienda limpieza dental',
      B:'Screen for cavities between the teeth (interproximal caries)/Se recomienda examinar por caries entre los dientes (inter proximal)',
      C:'Sealants application recommended/Se recomienda aplicacion de sellantes',
      D:'Stained teeth, please evaluate for cavities(caries)/ Manchas dentales, evaluar por caries',
      E:'Orthodontic work recommended (e.g. braces)/Trabajo de ortodoncia recomendado (frenos recomendados)'
    }
  },
  {
    title:'Early Dental Care Needed/Cuidado Dental temprano es necesario',
    options:{
      A:'Mild to moderate cavities (caries)/ Caries leve a moderado',
      B:'Gum disease/Enfermedad de las encias',
      C:'Soft tissue lesion/Lesiones de tejido blando',
      D:'Recent trauma/Trauma reciente',
      E:'Ectopic eruption(tooth entering the mouth in an abnormal way, e.g. crowding of baby teeth with adult teeth)/' +
      'Erupcion ectopica(dientes saliendo en posicion incorrecta. Ejemplo: dientes infantiles amontonando con dientes de adultos)',
    }
  },
  {
    title:'Urgent Care Needed/Se Necesita Atencion Urgente',
    options:{
      A:'Infection/Infeccion',
      B:'Pain/Dolor',
      C:'Severe cavities (caries)/ Caries profundas'
    }
  }
];
function calculateCheckList(checks){
  console.log('Processing check levels...')
  let checkLevels = []
  for(let i=0; i < checks.length; i++){
    let check = checks[i]
    let checkLevel = {index:i+1, title:check.title}
    let options = []
    for(var optionLetter in check.options){
      let option = {
        letter:optionLetter,
        index:checkLevel.index,
        value:`${checkLevel.index}/${optionLetter}`,
        text:check.options[optionLetter]
      }
      options.push(option)
    }
    options.sort((a,b)=>a.letter.charCodeAt(0)-b.letter.charCodeAt(0))
    checkLevel['options'] = options
    checkLevels.push(checkLevel)
  }
  return checkLevels
}
const checkLevels = calculateCheckList(checks)
export {
  checkLevels
}
