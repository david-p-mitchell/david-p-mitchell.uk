import md5 from 'blueimp-md5'

export function getGravatarUrl(email:String , size: number = 80, defaultImage: String = 'identicon') {
  if (!email) return `https://www.gravatar.com/avatar/?d=${defaultImage}&s=${size}`
  const hash = md5(email.trim().toLowerCase())
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`
}
