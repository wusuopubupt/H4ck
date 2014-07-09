cmake_minimum_required(VERSION 2.6)

project(voyage_worker)

if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE "Debug")
endif()

set(CXX_FLAGS
 -g
 # -DVALGRIND
 # -DMUDUO_STD_STRING
 -DCHECK_PTHREAD_RETURN_VALUE
 -D_FILE_OFFSET_BITS=64
 -Wall
 -Wextra
 -Werror
 -Wconversion
 -Wno-unused-parameter
 -Wold-style-cast
 -Woverloaded-virtual
 -Wpointer-arith
 -Wshadow
 -Wwrite-strings
 -march=native
 # -MMD
 # -std=c++0x
 -rdynamic
 )
if(CMAKE_BUILD_BITS EQUAL 32)
  list(APPEND CXX_FLAGS "-m32")
endif()
string(REPLACE ";" " " CMAKE_CXX_FLAGS "${CXX_FLAGS}")

set(CMAKE_LINKER "g++")
set(CMAKE_C_COMPILER "gcc")
set(CMAKE_CXX_COMPILER "g++")
set(CMAKE_CXX_FLAGS_DEBUG "-O0")
set(CMAKE_CXX_FLAGS_RELEASE "-O2 -finline-limit=1000 -DNDEBUG")
set(EXECUTABLE_OUTPUT_PATH ${PROJECT_BINARY_DIR}/bin)
set(LIBRARY_OUTPUT_PATH ${PROJECT_BINARY_DIR}/lib)

#link_directories(.)

string(TOUPPER ${CMAKE_BUILD_TYPE} BUILD_TYPE)
message(STATUS "CXX_FLAGS = " ${CMAKE_CXX_FLAGS} " " ${CMAKE_CXX_FLAGS_${BUILD_TYPE}})

#add_subdirectory(protobuf)
#add_subdirectory(libev)

#find_library(MY_LIBS libgearman.a libhiredis.a libzlib.a libmyprotocbuf-c.a)

#aux_source_directory(./protobuf PROTOBUF_SOURCE)
#add_executable(voyage_client_test gearman_client_test.c ../libev/ev.c ../libev/event.c ../utils.c ../json.c)

add_executable(voyage_worker_add_transaction add_transaction_list.c  ../libev/ev.c ../libev/event.c ../utils.c ../json.c)

add_executable(voyage_worker_delete_tid delete_tid.c ../libev/ev.c ../libev/event.c ../utils.c ../json.c)

include_directories(${CMAKE_SOURCE_DIR}/../)

target_link_libraries(voyage_worker_delete_tid
#${CMAKE_SOURCE_DIR}/../libwebscalesqlclient.a
${CMAKE_SOURCE_DIR}/../libgearman.a
stdc++
m crypt dl rt uuid pthread 
${CMAKE_SOURCE_DIR}/../libhiredis.a
${CMAKE_SOURCE_DIR}/../libzlib.a
${CMAKE_SOURCE_DIR}/../libyassl.a
#${CMAKE_SOURCE_DIR}/libwebscalesqlclient.a
${CMAKE_SOURCE_DIR}/../libtaocrypt.a
${CMAKE_SOURCE_DIR}/../libmyprotobuf-c.a)

target_link_libraries(voyage_worker_add_transaction
#${CMAKE_SOURCE_DIR}/../libwebscalesqlclient.a
${CMAKE_SOURCE_DIR}/../libgearman.a
stdc++
m crypt dl rt uuid pthread
${CMAKE_SOURCE_DIR}/../libhiredis.a
${CMAKE_SOURCE_DIR}/../libzlib.a
${CMAKE_SOURCE_DIR}/../libyassl.a
#${CMAKE_SOURCE_DIR}/libwebscalesqlclient.a
${CMAKE_SOURCE_DIR}/../libtaocrypt.a
${CMAKE_SOURCE_DIR}/../libmyprotobuf-c.a)
