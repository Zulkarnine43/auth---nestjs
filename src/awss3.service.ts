import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";

@Injectable()
export class AwsS3Service {
    AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    s3 = new AWS.S3
    ({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    });

    async s3_upload(file, name, mimetype)
    {
      const params = 
      {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: String(name),
          Body: file,
          ACL: "public-read",
          ContentType: mimetype,
          ContentDisposition:"inline",
          CreateBucketConfiguration: 
          {
              LocationConstraint: "ap-south-1"
          }
      };
      console.log(params);
      try
      {
          let s3Response = await this.s3.upload(params).promise();
  
          return s3Response;
      }
      catch (e)
      {
          return e;
      }
    }
}