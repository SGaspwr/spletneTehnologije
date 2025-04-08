"""An example of a simple HTTP server."""
import mimetypes
import socket

# Port number
PORT = 8080

# Header template for a successful HTTP request
# Return this header (+ content) when the request can be
# successfully fulfilled
HEADER_RESPONSE_200 = """HTTP/1.1 200 OK\r
Content-Type: %s\r
Content-Length: %d\r
Connection: Close\r
\r
"""

# Template for a 404 (Not found) error: return this when
# the requested resource is not found
RESPONSE_404 = """HTTP/1.1 404 Not found\r
Content-Type: text/html; charset=utf-8\r
Connection: Close\r
\r
<!DOCTYPE html>
<h1>404 Page not found</h1>
<p>Page cannot be found.</p>
"""


def parse_headers(client):
    headers = dict()
    while True:
        line = client.readline().decode('utf-8').strip()
        if not line:
            return headers
        key, value = line.split(":", 1)
        headers[key.strip()] = value.strip()


def process_request(connection, address, port):

    client = connection.makefile("wrb")

    line = client.readline().decode("utf-8").strip()
    try:
        method, uri, version = line.split()
        assert method == "GET", "Invalid request method"
        assert len(uri) > 0 and uri[0] == "/","Invalid request URI"
        assert version == "HTTP/1.1", "Invalid HTTP version"
        headers = parse_headers(client)
        print(method, uri, version, headers)


        filepath = uri[1:]

        mime_type, _ = mimetypes.guess_type(filepath)
        if mime_type is None:
            mime_type = "application/octet-stream"

        with open(filepath, "rb") as handle:
            body = handle.read()

        head = HEADER_RESPONSE_200 % (
            mime_type,
            len(body)
        )
        client.write(head.encode("utf-8"))
        client.write(body)

    except (ValueError, AssertionError) as e:
        print("Invalid request %s (%s)" % (line, e))
    except IOError:
        client.write(RESPONSE_404.encode("utf-8"))
    finally:
        client.close()


def main():
    """Starts the server and waits for connections."""

    # Create a TCP socket
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # To prevent "Address already in use" error while restarting the server,
    # set the reuse address socket option
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    # Bind on all network addresses (interfaces)
    server.bind(("", PORT))

    # Start listening and allow at most 1 queued connection
    server.listen(1)

    print("Listening on %d" % PORT)

    while True:
        # Accept the connection
        connection, (address, port) = server.accept()
        print("[%s:%d] CONNECTED" % (address, port))

        # Process request
        process_request(connection, address, port)

        # Close the socket
        connection.close()
        print("[%s:%d] DISCONNECTED" % (address, port))


if __name__ == "__main__":
    main()
