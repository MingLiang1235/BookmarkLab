#encoding: utf-8
#=====================================================================
# 	Propers: The TCPServer example and test programme for production.
#   Author:  JiShan
#   Email:  unicoder5191@163.com
#   Date:  2023-02-22
#=====================================================================
require 'logger'

$log = Logger.new('error.log', 5, 10*1024)
$log.level = Logger::DEBUG
$log.datetime_format = "%m-%d %H:%M:%S"
$log.info("Application starting")

def deflate_data(data)
	zipper = Zlib::Deflate.new
	
	zipper << "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 3.2 Final//EN'><html><head><title>MyRubyRespond</title></head><body>Now::#{Time.now.strftime("%m-%d %H:%M:%S")} #{data}</body></html>\r\n"
	data = zipper.deflate("", Zlib::FINISH)
end

def read_from_file(filename)
	begin
		$file = File.new(filename, "r")
		#file.print("#{data}<>#{Time.now.strftime("%Y-%m-%d %H:%M:%S")}\r\n")
		#$file.close
	
	rescue Exception
		$log.warn("Fail to Open file:" + $!)
		raise
	end
end
def search(str)
	rsl = Array.new
	# file = File.new("datafile", "r")
	$file.each{ |line| if line.index(str) != nil then rsl.insert(-1, line) end }
		# Note: Must use index, not scan.
	rsl.insert(-1,"^")
	$file.close
	return rsl
end

#======================打印程序头=======================
print "\r\n"
print ('=' * 29 + "\r\n")
puts "Start find test:(#{Time.now.strftime("|%Y-%m-%d %H:%M:%S")})"
print ('=' * 29)  # 29.times{print '='}
print "\r\n"
#=======================================================
begin
	read_from_file("test_data_file")  # read from file with data to dealing (to search).
	rsl = search("2023-02-11")
	puts 'Search "123":'
	puts "#{rsl}"

rescue Exception
	err = $!
	print("Search with file wrong:#{err}\r\n")
	$log.warn("Fail to Search:#{err}")
	raise
end


##  待做：  使用'|'、'@@'等分隔符会和一些title撞衫，所以有必要用换行符等更奇特的符。(目前使用'<>')