#!/bin/bash

# Give to the script as a parameter the name of the type of item that represents the module.
# In order to reformat and indent the code at the end, use the reformatting feature from Webstorm
# by right-clicking the files and pressing "Reformat code", then select the "Rearrange entries" option

item_type=$1
path_of_directory_to_be_copied="Exam-Project/ionic-project/src/todo"
new_directory_path="Exam-Project/ionic-project/src/${item_type}s"

cp -r $path_of_directory_to_be_copied $new_directory_path 

files=`ls -1 ${new_directory_path}`

for file in $files;
do
	uppercase_item="${item_type^}"
	actual_filepath="${new_directory_path}/${file}"
	filepath_with_replaced_item_name=`echo $actual_filepath | sed "s/Item/${uppercase_item}/g"`
	return_value=`mv $actual_filepath $filepath_with_replaced_item_name`
done	

new_files=`ls -1 ${new_directory_path}`

for new_file in $new_files;
do
	uppercase_item="${item_type^}"
	echo $new_file
	actual_filepath="${new_directory_path}/${new_file}"
	filepath_of_temporary_file="${new_directory_path}/tmp.tsx"
	touch $filepath_of_temporary_file
	cat $actual_filepath | while read -r line
	do
		content_with_replacements=`echo $line | sed "s/Item/${uppercase_item}/g" | sed "s/item/${item_type}/g" | sed "s/Ion${uppercase_item}/IonItem/g" | sed "s/photo.${item_type}Id/photo\.itemId/g"`
		echo $content_with_replacements >> $filepath_of_temporary_file
	done
	rm $actual_filepath
	mv $filepath_of_temporary_file $actual_filepath	
done	


path_of_backend_directory_to_be_copied="Exam-Project/node/src/note"
new_backend_directory_path="Exam-Project/node/src/${item_type}s"
cp -r $path_of_backend_directory_to_be_copied $new_backend_directory_path 

backend_files=`ls -1 ${new_backend_directory_path} | tail -n +2`

for new_file in $backend_files;
do
	uppercase_item="${item_type^}"
	echo $new_file
	actual_filepath="${new_backend_directory_path}/${new_file}"
	filepath_of_temporary_file="${new_backend_directory_path}/tmp.tsx"
	touch $filepath_of_temporary_file
	cat $actual_filepath | while read -r line
	do
		content_with_replacements=`echo $line | sed "s/note/${item_type}/g" | sed "s/Note/$uppercase_item/g" `
		echo $content_with_replacements >> $filepath_of_temporary_file
	done
	rm $actual_filepath
	mv $filepath_of_temporary_file $actual_filepath	
done	

