export async function downloadFromSignedUrl(signedUrl: string, filename: string) {
  const res = await fetch(signedUrl);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
