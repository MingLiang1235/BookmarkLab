#encoding: utf-8
#=====================================================================
# 	Propers: The TCPServer example and test programme for production.
#   Author:  JiShan
#   Email:  unicoder5191@163.com
#   Date:  2023-02-01
#=====================================================================
require 'socket'
require 'zlib'
require 'logger'

$log = Logger.new('error.log', 5, 10*1024)
$log.level = Logger::DEBUG
$log.datetime_format = "%m-%d %H:%M:%S"
$log.info("Application starting")

port = (ARGV[0] || 2121).to_i
server = TCPServer.new('0.0.0.0', port)  # nil or '0.0.0.0'

def deflate_data(data_)
	zipper = Zlib::Deflate.new
	#zipper << "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 3.2 Final//EN'><html><head><title>MyRubyRespond</title></head><body>Now::#{Time.now.strftime("%m-%d %H:%M:%S")} #{data_}</body></html>\r\n"
	zipper << "<div>#{data_}</div>\r\n"  # Double '\r\n'
	rtn_data_ = zipper.deflate("", Zlib::FINISH)
	#zipper = nil
	return rtn_data_
end

def write_to_file(data)
	begin
		file = File.new("datafile", "a+")
		file.print("#{data}<>#{Time.now.strftime("%Y-%m-%d %H:%M:%S")}\r\n")
		file.close
	
	rescue Exception
		$log.warn("Fail to Open or Write file:" + $!.to_s)
		file.close
		raise
	end
end
def search(str)
	rsl = Array.new
	file = File.new("datafile", "r")
	file.each{ |line| if (line.index(str) != nil) then rsl.insert(-1, line) end }
	file.close
	if (rsl.length > 0) then 
		return rsl
	else 
		return nil
	end
end

#======================打印表头============================
print "\r\n"
puts "#{Time.now.strftime("|%Y-%m-%d %H:%M:%S")} start...with port(#{port})"
print ('=' * 29)  # 29.times{print '='}
print "\r\n"
#=======================================================

#data_gziped = Zlib.gzip(data)  # To implemnets?
while (session = server.accept)
	begin
		search_rsl = nil
		gets = session.gets
		#puts gets
		gets_array = gets.split
		puts "Request: #{Time.now.strftime("%m-%d %H:%M:%S")}|#{gets_array}\r\n"
		data = gets_array[1][1..-1]  # 去掉起头的“/”号
		puts "Data middleing proceed: #{data}\r\n"
		if (data[0...3] == '?s=') then  # 为查询语句（判断前面的标记是否为?search=）。
			search_str = data[3..-1]
			search_rsl = search(search_str)
			#search_rsl = search_str
			puts "Search str: #{search_str}\r\n"
			puts "Search rsl: #{search_rsl}\r\n"
			if ( search_rsl && search_rsl.length == 0) then 
				data = search_rsl.to_s() 
			else
				data = "Have not found any entry to meet the request.#{Time.now.strftime("%Y-%m-%d %H:%M:%S")}"
			end
		else
			write_to_file(data)  # 为插入语句
		end
		puts "Data Before deflate: #{data}"
		data = deflate_data(data)
		session.print "HTTP/1.1 200/OK\r\nAccess-Control-Allow-Origin:*\r\nContent-Type:text/html\r\nContent-Encoding:deflate\r\nContent-Length:#{data.length}\r\n\r\n"
		session.print(data)
		#data = nil
		session.close

	rescue Exception
		err = $!
		print("Tcp session with wrong:#{err}\r\n")
		# session.close
		$log.warn("Fail to session:#{err}")
		raise
	end

end  # end of while
##  待做：  使用'|'、'@@'等分隔符会和一些title撞衫，所以有必要用换行符等更奇特的符。(目前使用'<>')