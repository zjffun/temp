const parseURI = (url: string) => {
  const urlObj = new URL(url);

  return `protocol: ${urlObj.protocol}
username: ${urlObj.username}
password: ${urlObj.password}
port: ${urlObj.port}
hostname: ${urlObj.hostname}
host: ${urlObj.host}
origin: ${urlObj.origin}
pathname: ${urlObj.pathname}
search: ${urlObj.search}
hash: ${urlObj.hash}
href: ${urlObj.href}`;
};

export default parseURI;
