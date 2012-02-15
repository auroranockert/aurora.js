def beautify(source)
  beautifier_source = File.read("#{VENDOR}/js-beautify/beautify.js")
  
  context = ExecJS.compile(beautifier_source)
  context.call("js_beautify", source)
end
