# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "moon"
  spec.version       = "0.1.0"
  spec.authors       = ["Chao Lin"]
  spec.email         = ["linchao@eccc.cc"]

  spec.summary       = %q{ Write a short summary, because Rubygems requires one.}
  spec.homepage      = "Put your gem's website or public repo URL here."
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|LICENSE|README)}i) }

  spec.add_runtime_dependency "jekyll", "~> 3.3"

  spec.add_development_dependency "bundler", "~> 1.12"
  spec.add_development_dependency "rake", "~> 10.0"
end
