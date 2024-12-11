interface Colour {
  r: number
  g: number
  b: number
  a: number
}

export interface Star {
  x: number
  y: number
  r: number
  colour: Colour
}

function generateStar(w: number, h: number): Star {
  const rVal = Math.floor(Math.random() * 155) + 100
  const gVal = Math.floor(Math.random() * 155) + 100
  const bVal = Math.floor(Math.random() * 155) + 100

  let c: Colour = {
    r: rVal,
    g: gVal,
    b: bVal,
    a: 255
  }

  let star: Star = {
    x: Math.floor(Math.random() * w),
    y: Math.floor(Math.random() * h),
    r: Math.random() * 3,
    colour: c
  }
  return star
}

export function StarField(w: number, h: number, numStars: number) {
  let starArr = []
  for (let i = 0; i < numStars; i++) {
    starArr.push(generateStar(w, h))
  }
  return starArr
}
