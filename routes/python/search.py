import sys
import re
import datetime
import json
import ibm_db
import os
from dotenv import load_dotenv

load_dotenv() #loads DB passowrd from env file

DB_CONNECT_URL = os.getenv('DB_CONNECT_URL') #creates DB connection

textFile = sys.argv[1] #sylibus being passed in
logFile = "foundLog.txt" #optional log file for debugging

checked = [] #array of checked elemets to search for

conn = ibm_db.connect(DB_CONNECT_URL, "", "")
quryName = ibm_db.exec_immediate(conn , "SELECT ITEM_NAME FROM CHECKLIST;")
quryChecked = ibm_db.exec_immediate(conn , "SELECT CHECKED FROM CHECKLIST;")

sql = "SELECT ITEM_NAME FROM CHECKLIST WHERE CHECKED = true" #SQL statement
stmt = ibm_db.exec_immediate(conn, sql)
tuple = ibm_db.fetch_tuple(stmt) #gets tupple from DB

i = 0

while tuple != False: #loops through tuple to make checked array
    #print "Key: ", tuple[0]
    checked.append(tuple[0])
    tuple = ibm_db.fetch_tuple(stmt)

#print(checked)

keywords = {    #list of regex commands meant to seach for items
                "courseDes":      ["course( )*description" , "course description" , "class description" , "course overview"] ,
                "courseObj":      ["objective(.)*course" , "course(.)*objective" , "course(.)*expectations" , "expectations(.)*course" , "learning outcomes" , "learning objectives"] ,
                "courseCred":     ["[0-9]( )*credit" , "number of credits"] , #need to investigate
                "preReq":         ["pre(.)*requisite" , "pre(.)*req"] ,
                "gradeDet":       ["grading:" , "[0-9]([0-9])*( )*points" , "assessment" , "grading" , "evaluation" , "grade allocation"] ,
                "otherpolicies":  ["policy" , "policies" , "academic(.)*honesty"] ,
                "instrName":      ["professor" , "dr", "ph(.)d", "phd", "professor", "instructor"] ,
                "instrContact":   ["e(-| )mail:" , "contact:" , "email(-|:)" , "@marist.edu", "gmail"] ,
                "demoConsistant": [] , # not sure if this can be checked with keywords
                "assesMethod":    ["grading(.)*method", "grading"] ,
                "rubrics":        ["rubric"] , # may be missing
                "biblio":         ["bibliography"] ,
                "assignments":    ["assignments" , "bee"] ,
                "taskCrit":       [] ,
                "courseNum":      ["[0-9]{3}( |_)*(N|L|n|l)( |_)*[0-9]{3}" , "course( )*number" , "class( )*number" , "[0-9]{3}( )*(N|L|n|l)"] ,
                "format":         ["in(-| |.)person", "WebEx", "video" , "zoom", "video", "remote(.)course" , "online(.)course" , "hybrid", "hybrid(.)course" , "zoom" , "video"] ,
                "attenPol":       ["attendance" , "attendance(.)policy" , "absent", "participation"] ,
                "reqRead":        ["required(.*)read" , "read(.*)required" , "Textbook" , "ISBN" , "test(.)*course" , "doi" , "course materials" , "required(.)*text" , "text(.)*required", "text"] ,
                "acadHonest":     ["academic honesty" , "cheating" , "plagiarism"] ,
                "teachAct":       ["Materials used in connection" , "subject to copyright protection"] ,
                "accommod":       ["Students with disabilities" , "accommodations", "accessibility"] ,
                "diversity":      ["diversity"] , # not technically req
            }

found = {   #empty dictionary of arrays to store any matches to analyize later
            "courseDes":      [] ,
            "courseObj":      [] ,
            "courseCred":     [] ,
            "preReq":         [] ,
            "gradeDet":       [] ,
            "otherpolicies":  [] ,
            "instrName":      [] ,
            "instrContact":   [] ,
            "demoConsistant": [] , # not sure if this can be checked with keywords
            "assesMethod":    [] ,
            "rubrics":        [] , # may be missing
            "biblio":         [] ,
            "assignments":    [] ,
            "taskCrit":       [] ,
            "courseNum":      [] ,
            "format":         [] ,
            "attenPol":       [] ,
            "reqRead":        [] ,
            "acadHonest":     [] ,
            "teachAct":       [] ,
            "accommod":       [] ,
            "diversity":      [] , # not technically req
        }

keyToName = {   #empty dictionary of arrays to store any matches to analyize later
                "courseDes":      "Course Description" ,
                "courseObj":      "Course Objectives" ,
                "courseCred":     "Credits allocated to course" ,
                "preReq":         "Pre-requisites" ,
                "gradeDet":       "Basis of grade determination  (please state if there are none)" ,
                "otherpolicies":  "Other course policies related to integrity of credit" ,
                "instrName":      "Instructor's name" ,
                "instrContact":   "Instructor's contact information" ,
                "demoConsistant": "Syllabi are demonstrably consistent with comparable courses at other institutions and embed the content and skill expectations of professional associations in field" , # not sure if this can be checked with keywords
                "assesMethod":    "Method of assessment: Indicate a measured way to determine student success and learning outcomes" ,
                "rubrics":        "Rubrics at course and project levels" , # may be missing
                "biblio":         "Bibliographic resources/ Other resources, including audio-visual aids" ,
                "assignments":    "Assignments: Term papers, assignment synopses, examinations, etc." ,
                "taskCrit":       "Demonstrate that the course meets time on task criteria, college-level, rigor, and credit granted only to those meeting these objectives" ,
                "courseNum":      "Course number must be designated as L (liberal arts) or N (non-liberal arts)." ,
                "format":         "Classroom format (lecture, lab, discussion)" ,
                "attenPol":       "Attendance policy" ,
                "reqRead":        "Semester required reading" ,
                "acadHonest":     "Statement on academic honesty" ,
                "teachAct":       "TEACH Act disclosure" ,
                "accommod":       "Accommodations & Accessibility Statement" ,
                "diversity":      "Statement on diversity" , # not technically req
        }

missing = [] #list of missing elements

score = "" #makes score global var

cmdIdex = 0

def checkFileAnal(): #check file analysis, will continue to check past the first match
    #print("checking file...")
    #print(keywords)
    now = datetime.datetime.now()

    #o = open(logFile, "a")
    #o.write("\n\n\n\nOutput for " + textFile + " on " + now.strftime("%Y-%m-%d %H:%M:%S")) #text file will be the sylibus being evaluated


    s = open(textFile, encoding="utf-8") #opens text file

    for line in s: #finds e-mail address to identify teachers name
        result = re.search("@marist.edu" , line , re.IGNORECASE)

    if(result != None): #isolates teachers name
        result = result[result.index(".") + 1:result.index("@")]

    #keywords.get("instrName").append(result)

    s.seek(0)

    matches = 0
    cmdIdex = 0

    for key in keywords: #loops through entire dictionary
        if key in checked:
            #o.write("\n\nResults for " + key + ":")
            try:
                for line in s: #loops through each line of sylibus
                    cmdIdex = 0
                    for i in keywords[key]: #loops through each regex search
                        #print(i)
                        cmdList = keywords[key]
                        result = re.search(i , line , re.IGNORECASE) #searches line for regex command
                        if(result != None):
                            matches += 1
                            found[key].append(result)
                            match = line[result.span()[0] : result.span()[1]]
                            #o.write("\nMatch to \"" + i + "\" in line \"" + line[0 : -2] + "\": " + match)

                s.seek(0) #sets file pointer back to the begining
            except:
                pass
                #print("ERROR LINE COULD NOT BE READ")

    #print("file checked, " + str(matches) + " matches found")

    score = getScore()
    #print("Score: " + score)

    return found


def checkFileFast(): #discontinued function to opmimize speed, turned out to not be an issue
    print("checking file...")
    #print(keywords)

    o = open(logFile, "a")
    o.write("\n\n\n\nOutput for " + "textFile") #text file will be the sylibus being evaluated

    s = open(textFile, encoding="utf-8")

    matches = 0
    cmdIdex = 0

    for key in keywords: #loops through entire dictionary
        o.write("\n\nResults for " + key + ":")
        for line in s: #loops through each line of sylibus
            cmdIdex = 0
            for i in keywords[key]: #loops through each regex search
                cmdList = keywords[key]
                result = re.search(i , line) #searches line for regex command
                if(result != None):
                    matches += 1
                    found[key] = result
                    match = line[result.span()[0] : result.span()[1]]
                    o.write("\nMatch to \"" + i + "\" in line \"" + line[0 : -2] + "\": " + match)

        s.seek(0) #sets file pointer back to the begining

    print("file checked, " + str(matches) + " matches found")
    return found

def getScore(): #gets the socre
    #print("Score Calculateing")

    neededItems = 0
    foundItems = 0
    score = ""

    for key in keywords: #totals missing and found items
        if key in checked:
            neededItems += 1
            if(len(found[key]) != 0):
                foundItems += 1
            else:
                missing.append(keyToName[key])

    #print("Missing elements:\n")
    #print(missing)
    #print()

    #makes sure it never divides by 0
    if(neededItems == 0):
        neededItems = 1

    percent = foundItems / neededItems

    #print("Total Items = " + str(neededItems))
    #print("Found Items = " + str(foundItems))
    #print("% found = " + str(percent))

    if(percent >= 1): #grade scale
        score = "A+"
        return "A+"
    elif(percent >= .93):
        score = "A"
        return "A"
    elif(percent >= .89):
        score = "A-"
        return "A-"
    elif(percent >= .85):
        score = "B+"
        return "B+"
    elif(percent >= .82):
        score = "B"
        return "B"
    elif(percent >= .80):
        score = "B-"
        return "B-"
    elif(percent >= .77):
        score = "C+"
        return "C+"
    elif(percent >= .75):
        score = "C"
        return "C"
    elif(percent >= .72):
        score = "C-"
        return "C-"
    elif(percent >= .69):
        score = "D+"
        return "D+"
    elif(percent >= .65):
        score = "D"
        return "D"
    elif(percent >= .60):
        score = "D-"
        return "D-"
    else:
        score = "F"
        return "F"

class Output:
    def __init__(self , score , missing):
        self.score = score
        self.missing = missing

def makeOutput(): #prints out json object for results page to read
    #output = Output(score , missing)
    jsonOutput = '{ "Missing":' + json.dumps(missing) + ', "Grade":' + '"' + getScore() + '"' + "}"
    print(jsonOutput)
    sys.stdout.flush()

checkFileAnal()
makeOutput()
