package edu.isi.karma.mapreduce.driver;

import org.apache.hadoop.io.Text;
import org.junit.Assert;
import org.junit.Test;

import edu.isi.karma.mapreduce.function.MergeJSON;

public class TestMergeJSON {
	@Test
	public void testMerge() {
		MergeJSON test = new MergeJSON();
		String a = " {\"syll:twitterId\":\"caknoblock\",\"@type\":\"http://lod.isi.edu/ontology/syllabus/Person\",\"foaf:homepage\":{\"@type\":\"http://xmlns.com/foaf/0.1/Document\",\"@id\":\"http://www.isi.edu/~knoblock\"},\"foaf:name\":\"Craig Knoblock\",\"foaf:lastName\":\"Knoblock\",\"@id\":\"http://lod.isi.edu/cs548/person/Knoblock\",\"id\":\"http://lod.isi.edu/cs548/person/Knoblock\",\"foaf:depiction\":{\"@type\":\"http://xmlns.com/foaf/0.1/Image\",\"@id\":\"http://www.isi.edu/integration/people/knoblock/img/CraigKnoblock.jpg\",\"foaf:depicts\":\"<http://lod.isi.edu/cs548/person/Knoblock>\"},\"foaf:title\":\"Prof\",\"foaf:mbox\":\"mailto:knoblock@isi.edu\"}";
		String b = " {\"rdfs:label\":\"knoblock@isi.edu\",\"@type\":\"http://www.w3.org/2002/07/owl#Thing\",\"@id\":\"mailto:knoblock@isi.edu\",\"id\":\"mailto:knoblock@isi.edu\"}";
		Text result = test.evaluate(new Text(a), new Text(b), new Text("foaf:mbox"));
		String expected = "{\"id\":\"http://lod.isi.edu/cs548/person/Knoblock\",\"syll:twitterId\":\"caknoblock\",\"@type\":\"http://lod.isi.edu/ontology/syllabus/Person\",\"foaf:homepage\":{\"@type\":\"http://xmlns.com/foaf/0.1/Document\",\"@id\":\"http://www.isi.edu/~knoblock\"},\"foaf:lastName\":\"Knoblock\",\"foaf:name\":\"Craig Knoblock\",\"foaf:depiction\":{\"@type\":\"http://xmlns.com/foaf/0.1/Image\",\"@id\":\"http://www.isi.edu/integration/people/knoblock/img/CraigKnoblock.jpg\",\"foaf:depicts\":\"<http://lod.isi.edu/cs548/person/Knoblock>\"},\"@id\":\"http://lod.isi.edu/cs548/person/Knoblock\",\"foaf:title\":\"Prof\",\"foaf:mbox\":{\"id\":\"mailto:knoblock@isi.edu\",\"rdfs:label\":\"knoblock@isi.edu\",\"@type\":\"http://www.w3.org/2002/07/owl#Thing\",\"@id\":\"mailto:knoblock@isi.edu\"}}";
		Assert.assertEquals(result.toString(), expected);
	}
	
	@Test
	public void testMerge2() {
		MergeJSON test = new MergeJSON();
		String a = "{\r\n    \"@type\": \"http://dig.isi.edu/ontology/URLEntity\",\r\n    \"dig:snapshot\": {\r\n        \"dig:hasTitlePart\": {\r\n            \"@type\": \"http://schema.org/WebPageElement\",\r\n            \"@id\": \"https://karmadigstorage.blob.core.windows.net/arch/churl/20140301/losangeles.backpage.com/FemaleEscorts/undeniable-latina-hottie-1oohh-160hr-rainy-day-specials-_-24/38317518/title\"\r\n        },\r\n        \"dig:hasBodyPart\": {\r\n            \"dig:mentionsPhoneNumber\": {\r\n                \"dig:tenDigitPhoneNumber\": \"8052536469\",\r\n                \"schema:location\": {\r\n                    \"@type\": \"http://schema.org/Place\",\r\n                    \"@id\": \"http://dig.isi.edu/data/exchange/805253\"\r\n                },\r\n                \"@type\": \"http://dig.isi.edu/ontology/PhoneNumber\",\r\n                \"@id\": \"http://dig.isi.edu/data/phonenumber/8052536469\"\r\n            },\r\n            \"@type\": \"http://schema.org/WebPageElement\",\r\n            \"@id\": \"https://karmadigstorage.blob.core.windows.net/arch/churl/20140301/losangeles.backpage.com/FemaleEscorts/undeniable-latina-hottie-1oohh-160hr-rainy-day-specials-_-24/38317518/body\"\r\n        },\r\n        \"@type\": \"http://schema.org/WebPage\",\r\n        \"@id\": \"https://karmadigstorage.blob.core.windows.net/arch/churl/20140301/losangeles.backpage.com/FemaleEscorts/undeniable-latina-hottie-1oohh-160hr-rainy-day-specials-_-24/38317518\"\r\n    },\r\n    \"@id\": \"http://losangeles.backpage.com/FemaleEscorts/undeniable-latina-hottie-1oohh-160hr-rainy-day-specials-_-24/38317518\"\r\n}";
		String b = "{\r\n    \"@type\": \"http://schema.org/Place\",\r\n    \"schema:geo\": {\r\n        \"schema:longitude\": \"-119.176487\",\r\n        \"@type\": \"http://schema.org/GeoCoordinates\",\r\n        \"schema:latitude\": \"34.196012\",\r\n        \"@id\": \"http://dig.isi.edu/data/exchange/805253/geo\"\r\n    },\r\n    \"@id\": \"http://dig.isi.edu/data/exchange/805253\",\r\n    \"schema:address\": {\r\n        \"schema:addressLocality\": \"Oxnard\",\r\n        \"@type\": \"http://schema.org/PostalAddress\",\r\n        \"schema:addressRegion\": \"California\",\r\n        \"@id\": \"http://dig.isi.edu/data/exchange/805253/postaladdress\"\r\n    }\r\n}";
		Text result = test.evaluate(new Text(a), new Text(b), new Text("dig:snapshot/dig:hasBodyPart/dig:mentionsPhoneNumber/schema:location"));
		System.out.println(result.toString());
	}
}
