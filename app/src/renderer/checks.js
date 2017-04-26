
let checks = [
  {
    title: 'Routine Dental Care Recommended/<em>Se recomienda Atencion Dental de Rutina</em>',
    options: {
      A: 'Dental cleaning recommended/<em>Se recomienda limpieza dental</em>',
      B: 'Screen for cavities between the teeth (interproximal caries)/<em>Se recomienda examinar por caries entre los dientes (inter proximal)</em>',
      C: 'Sealants application recommended/<em>Se recomienda aplicacion de sellantes</em>',
      D: 'Stained teeth, please evaluate for cavities(caries)/<em>Manchas dentales, evaluar por caries</em>',
      E: 'Orthodontic work recommended (e.g. braces)/<em>Trabajo de ortodoncia recomendado (frenos recomendados)</em>'
    }
  },
  {
    title: 'Urgent Dental Care Needed/<em>Cuidado Dental urgente es necesario</em>',
    options: {
      A: 'Mild to moderate cavities (caries)/<em>Caries leve a moderado</em>',
      B: 'Gum disease/<em>Enfermedad de las encias</em>',
      C: 'Soft tissue lesion/<em>Lesiones de tejido blando</em>',
      D: 'Recent trauma/<em>Trauma reciente</em>',
      E: 'Ectopic eruption(tooth entering the mouth in an abnormal way, e.g. crowding of baby teeth with adult teeth)/<em>' +
      'Erupcion ectopica(dientes saliendo en posicion incorrecta. Ejemplo: dientes infantiles amontonando con dientes de adultos)</em>'
    }
  },
  {
    title: 'Emergency Care Needed/<em>Se Necesita Atencion de Emergencia</em>',
    options: {
      A: 'Infection/<em>Infeccion</em>',
      B: 'Pain/<em>Dolor</em>',
      C: 'Severe cavities (caries)/<em>Caries profundas</em>'
    }
  }
]
function calculateCheckList (checks) {
  console.log('Processing check levels...')
  let checkLevels = []
  for (let i = 0; i < checks.length; i++) {
    let check = checks[i]
    let checkLevel = {index: i + 1, title: check.title}
    let options = []
    for (var optionLetter in check.options) {
      let option = {
        letter: optionLetter,
        index: checkLevel.index,
        value: `${checkLevel.index}/${optionLetter}`,
        text: check.options[optionLetter]
      }
      options.push(option)
    }
    options.sort((a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0))
    checkLevel['options'] = options
    checkLevels.push(checkLevel)
  }
  return checkLevels
}
const checkLevels = calculateCheckList(checks)
export {
  checkLevels
}
