import { NextRequest } from 'next/server';

export function createMockRequest(
  method: string = 'GET',
  url: string = 'http://localhost:3000/api/test',
  body?: any
): NextRequest {
  const requestHeaders = new Headers();

  if (body instanceof FormData) {
    return new NextRequest(url, {
      method,
      headers: requestHeaders,
      body,
    });
  }

  if (body) {
    requestHeaders.set('Content-Type', 'application/json');
    return new NextRequest(url, {
      method,
      headers: requestHeaders,
      body: JSON.stringify(body),
    });
  }

  return new NextRequest(url, {
    method,
    headers: requestHeaders,
  });
}

export function createMockFormData(data: Record<string, any>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value as string);
    }
  }

  return formData;
}

export function createMockFile(name: string = 'test.mp3', type: string = 'audio/mpeg', size: number = 1024): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}
