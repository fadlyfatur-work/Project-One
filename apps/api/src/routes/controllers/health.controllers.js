export function healthCheck(req, res) {
  res.json({
    ok: true,
    service: "api",
    time: new Date().toISOString()
  });
}
