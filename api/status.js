export default function handler(req, res) {
  res.status(200).json({
    dynamic: true,
    time: new Date().toISOString(),
  })
}
