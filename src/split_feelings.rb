line_num=0
text=File.open('feelings.txt').read
text.gsub!(/\r\n?/, "\n")
feelings=[]
text.each_line do |line|
  split_line = line.split(" ")
  feelings << split_line[0]
end
feelings.shift
File.write("data.json", feelings)
