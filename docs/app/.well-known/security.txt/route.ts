// Serves /.well-known/security.txt (RFC 9116) so scanners and researchers can
// find the private reporting channel without a personal contact address.
//
// `force-static` makes Next run this handler at build time, so `Expires` is
// computed from the build date. Rebuilding the site refreshes it.

export const dynamic = "force-static";

/** How long the file stays valid after each build. */
const VALID_FOR_DAYS = 365;

const REPORTING_URL = "https://github.com/Stellar-Hive/stellar-stream-hive-api/security/advisories/new";
const POLICY_URL = "https://github.com/Stellar-Hive/stellar-stream-hive-api/blob/main/SECURITY.md";

export function GET() {
  const expires = new Date(Date.now() + VALID_FOR_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const body = [
    `Contact: ${REPORTING_URL}`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Policy: ${POLICY_URL}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
