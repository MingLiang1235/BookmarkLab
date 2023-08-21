#encoding: utf-8
# File: tcp_web_server.rb
# Propers: The TCPServer example and test programme for production.

require 'socket'
require 'zlib'
require 'logger'

log = Logger.new('error.log', 5, 10*1024)
log.level = Logger::DEBUG
log.datetime_format = "%m-%d %H:%M:%S"
log.info("Application starting")
port = (ARGV[0] || 2121).to_i
server = TCPServer.new('0.0.0.0', port)  # nil or '0.0.0.0'

def deflate_data(data)
	zipper = Zlib::Deflate.new
	
	zipper << "<html><head><title>MyRubyRespond</title></head><body>Now::#{Time.now.strftime("%m-%d %H:%M:%S")} #{data}</body></html>\r\n"
	data = zipper.deflate("", Zlib::FINISH)
end

def write_to_file(data)
	begin
		file = File.new("datafile", "a+")
		file.print("#{data}<>#{Time.now.strftime("%Y-%m-%d %H:%M:%S")}\r\n")
		file.close
	
	rescue Exception
		log.warn("Fail to Open or Write file:" + $!.to_s)
		file.close
		raise
	end
end
def search(str)
	rsl = Array.new
	file = File.new("datafile", "w")
	file.foreach{ |line| if line.scan(str) != Nil then rsl.insert(-1, line) end }
	return rsl
end

#======================打印表头============================
print "\r\n"
puts "#{Time.now.strftime("|%Y-%m-%d %H:%M:%S")} start...with port(#{port})"
print ('=' * 29)  # 29.times{print '='}
print "\r\n"
#==========================================================

#data_gziped = Zlib.gzip(data)  # To implemnets?
while (session = server.accept)
	begin
		gets = session.gets
		#puts gets
		gets_array = gets.split
		puts "Request: #{Time.now.strftime("%m-%d %H:%M:%S")}|#{gets_array}"
		data = gets_array[1]

		write_to_file(data)


		data = deflate_data(data)
		session.print "HTTP/1.1 200/OK\r\nAccess-Control-Allow-Origin:*\r\nContent-Type:text/html\r\nContent-Encoding:deflate\r\nContent-Length:#{data.length}\r\n\r\n"
		session.print data
		session.close

	rescue Exception
		err = $!
		print("Tcp session with wrong:#{err}\r\n")
		session.close
		log.warn("Fail to session:#{err}")
		raise
	end

end  # end of while
##  待做：  使用'|'、'@@'等分隔符会和一些title撞衫，所以有必要用换行符等更奇特的符。(目前使用'<>')