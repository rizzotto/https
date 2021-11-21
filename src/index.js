/**
 * @author Guilherme Sbroglio Rizzotto
 * date: 21/11/2021
 *
 * Data:
 *  A: 6ee3fc3c4b59070e785bdfbdbe44756f1a678ce24da651dd16d0e599df7c878ca036f1943ad90ca36ad2a058369e79cb1bb837e73ad1878034cfe48a5cc58653a5462a3a3390c2de889f04c17694473cf082bbfec7876052f41131f06240725132b341feba81c75225afc84a271e7fa9d9a3eb58ecf9a2f933a004e5364b01d2
 *  B: 00AE86A272CBE9AA33DDC7DE6F9A8B5057A950BC4FFAC43F2ED4C2864186152C57FEBFFCF018F97892C5639DBD6374FCCA2DC21FCC61FB9E290E9798A49CEBB53E5E4369EC322D30EBFA736551E0D15A9B190A403070A4F372F27EDAE9846CAE0FF272B417DB640C5D076D1FEC03BFDBF2553649F04E55614B6CA61CDFC171F7EE
 *  S: 1617d1ed11dc8912028be3590fcaa305312dfb5acda884e1c4fb2c6486a784b4
 *  V: 25d9e308cf4603f38329bdbc54a477cdaaef9fafecc5bd6da5344042727beab57e3e428e14371cbab20c0aac6cdf80e7514f4f34a42877496acd970ce9bc99807ebb2dd2a19dcd3639f3b8ecf7fb366e61ce1f9d584d994af6faed1a24b79afb81a1be687c80e018cba7522ad222d8244d93f13d761b2f0127e6977fa1c93da9
 *  MSG: 638B332AF361615BD86C2E57649C4AE3D42FD787A019DFC01FC57D9D2A8BD7292032BB34EFBEA45652696F814F385F359DC22801296F940D60CE20E6DAFB4CB3D9D765A2F40ACD0032F0DB50A2DFE7A39DBD1826383061F31732F09316B67F51
 *  Plain text: Excelente. Agora inverte esta mensagem e me envia de volta cifrada
 *  Confirmation Message: Pronto. Agora comenta bem o código, coloca este exemplo completo no início do código como comentário e submete no Moodle. Bom resto de domingo :-).
 *
 *  How to run: In root, run `npm run start`
 */

const crypto = require('crypto')

const p =
  'B10B8F96A080E01DDE92DE5EAE5D54EC52C99FBCFB06A3C69A6A9DCA52D23B616073E28675A23D189838EF1E2EE652C013ECB4AEA906112324975C3CD49B83BFACCBDD7D90C4BD7098488E9C219A73724EFFD6FAE5644738FAA31A4FF55BCCC0A151AF5F0DC8B4BD45BF37DF365C1A65E68CFDA76D4DA708DF1FB2BC2E4A4371'
const g =
  'A4D1CBD5C3FD34126765A442EFB99905F8104DD258AC507FD6406CFF14266D31266FEA1E5C41564B777E690F5504F213160217B4B01B886A5E91547F9E2749F4D7FBD7D3B9A92EE1909D0D2263F80A76A6A24C087A091F531DBF0A0169B6A28AD662A4D18E73AFA32D779D5918D08BC8858F4DCEF97C2A24855E6EEB22B3B2E5'
const B =
  '00AE86A272CBE9AA33DDC7DE6F9A8B5057A950BC4FFAC43F2ED4C2864186152C57FEBFFCF018F97892C5639DBD6374FCCA2DC21FCC61FB9E290E9798A49CEBB53E5E4369EC322D30EBFA736551E0D15A9B190A403070A4F372F27EDAE9846CAE0FF272B417DB640C5D076D1FEC03BFDBF2553649F04E55614B6CA61CDFC171F7EE'
const MSG =
  '638B332AF361615BD86C2E57649C4AE3D42FD787A019DFC01FC57D9D2A8BD7292032BB34EFBEA45652696F814F385F359DC22801296F940D60CE20E6DAFB4CB3D9D765A2F40ACD0032F0DB50A2DFE7A39DBD1826383061F31732F09316B67F51'

function getS(V) {
  // https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
  const fromHexString = (string) =>
    new Uint8Array(string.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))

  const bufferedV = Buffer.from(fromHexString(BigInt(V).toString(16)))
  return crypto.createHash('sha256').update(bufferedV).digest('hex')
}

function decrypt(msg, password) {
  const key = Buffer.from(password, 'hex')

  const bufferLength = Buffer.from(msg, 'hex').length

  const encoded = Buffer.alloc(bufferLength, msg.slice(32, msg.length), 'hex')

  var iv = Buffer.from(msg.slice(0, 32), 'hex')

  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
  return decipher.update(encoded).toString()
}

function encrypt(msg, password) {
  let iv = Buffer.from(crypto.randomBytes(16)).toString('hex').slice(0, 16)
  let cipher = crypto.createCipheriv(
    'aes-128-cbc',
    Buffer.from(password, 'hex'),
    iv
  )
  let encrypted = cipher.update(msg)

  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv + ':' + encrypted.toString('hex')
}

function run() {
  // Calculate A
  const a = BigInt(411)
  const bigP = BigInt('0x' + p)
  const bigG = BigInt('0x' + g)

  const A = bigG ** a % bigP

  console.log(`A: ${BigInt(A).toString(16)}\n`)

  // Calculate V
  const bigB = BigInt('0x' + B)
  const V = String(bigB ** a % bigP)

  console.log(`V: ${BigInt(V).toString(16)}\n`)

  // Calculate SHA256 (S)
  const S = getS(V)
  console.log(`S: ${S}\n`)

  // Calculate key
  const password = S.slice(0, 32)
  console.log(`Password: ${password}\n`)

  // Decrypt
  const decryptedMessage = decrypt(MSG, password)
  console.log(`Message: ${decryptedMessage}\n`)

  // Encrypt
  const reversedMessage = decryptedMessage.split('').reverse().join('')
  const encryptedMessage = encrypt(reversedMessage, password).toUpperCase()
  console.log(`Reversed: ${reversedMessage}\n`)
  console.log(`Encrypted Message: ${encryptedMessage}`)
}

run()
