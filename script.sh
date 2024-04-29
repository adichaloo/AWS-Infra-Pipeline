if [ $# -ne 4 ]; then
    echo "Usage: $0 <source_file> <destination_file> <additional_input> <bucket_name>"
    exit 1
fi

# Assign command-line arguments to variables
source_file="$1"
destination_file="$2"
additional_input="$3"
bucket_name="$4"

# Download source file from S3 bucket
aws s3 cp "s3://$bucket_name/$source_file" "$source_file"

# Check if the source file exists
if [ -f "$source_file" ]; then
    # Read contents from source file
    source_content=$(<"$source_file")

    # Concatenate source content and additional input with ":"
    output_content="$source_content:$additional_input"

    # Write concatenated content to destination file
    echo "$output_content" > "$destination_file"
    echo "Contents written to $destination_file"

    # Upload destination file to S3 bucket
    aws s3 cp "$destination_file" "s3://$bucket_name/$destination_file"
    echo "Destination file uploaded to S3 bucket $bucket_name"
else
    echo "Source file $source_file does not exist"
fi