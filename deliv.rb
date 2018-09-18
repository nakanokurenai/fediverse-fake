# remove after used http openssl
require 'http'
require 'openssl'

document      = File.read('fake3.json')
date          = Time.now.utc.httpdate
keypair       = OpenSSL::PKey::RSA.new(File.read('private.pem'))
signed_string = "(request-target): post /inbox\nhost: mastodon.social\ndate: #{date}"
signature     = Base64.strict_encode64(keypair.sign(OpenSSL::Digest::SHA256.new, signed_string))
header        = 'keyId="https://a223ccf9.ngrok.io/@fake3#key",headers="(request-target) host date",signature="' + signature + '"'

print header
print date
