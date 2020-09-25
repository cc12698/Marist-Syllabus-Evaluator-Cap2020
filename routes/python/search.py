import sys
import re
import datetime

textFile = sys.argv[1]#"exampleText.txt"
logFile = "foundLog.txt"

checked = ["courseDes" , "courseObj" , "courseCred" , "preReq" , "gradeDet" ,
           "otherpolicies" , "instrName" , "instrContact" , #"demoConsistant" ,
           "assesMethod" , "assignments" , #"taskCrit" ,
           "courseNum" , "format" , "attenPol" , "reqRead" , "acadHonest" ,
           "teachAct" , "accommod" , ] #"diversity"]

keywords = {    #list of regex commands ment to seach for items
                "courseDes":      ["course( )*description" , "course description" , "class description"] ,
                "courseObj":      ["objective(.)*course" , "course(.)*objective"] ,
                "courseCred":     ["[0-9]( )*credit"] , #need to investigate
                "preReq":         ["pre(.)*requisite" , "pre(.)*req"] ,
                "gradeDet":       ["grading:" , "[0-9]([0-9])*( )*points" , "assessment" , "grading"] ,
                "otherpolicies":  ["policy" , "policies" , "academic(.)*honesty"] ,
                "instrName":      ["professor" , "Dr"] ,
                "instrContact":   ["e(-| )mail:" , "contact:" , "email(-|:)" , "@marist.edu"] ,
                "demoConsistant": [] , # not sure if this can be checked with keywords
                "assesMethod":    ["grading(.)*method"] ,
                "rubrics":        ["rubric"] , # may be missing
                "biblio":         ["bibliography"] ,
                "assignments":    ["assignments" , "bee"] ,
                "taskCrit":       [] ,
                "courseNum":      ["[0-9]{3}( |_)*(N|L|n|l)( |_)*[0-9]{3}" , "course( )*number" , "class( )*number" , "[0-9]{3}( )*(N|L|n|l)"] ,
                "format":         ["remote(.)course" , "online(.)course" , "hybrid(.)course"] ,
                "attenPol":       ["attendance" , "attendance(.)policy" , "absent"] ,
                "reqRead":        ["required(.*)read" , "read(.*)required" , "Textbook" , "ISBN" , "test(.)*course"] ,
                "acadHonest":     ["academic honesty" , "cheating" , "plagiarism"] ,
                "teachAct":       ["Materials used in connection" , "subject to copyright protection"] ,
                "accommod":       ["Students with disabilities" , "accommodations and accessibility"] ,
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
                "courseDes":      "Course description" ,
                "courseObj":      "Course objectives" ,
                "courseCred":     "Credits allocated to course" ,
                "preReq":         "Pre-requisites" ,
                "gradeDet":       "Basis of grade determination  (please state if there are none)" ,
                "otherpolicies":  "Other course policies related to integrity ofcredit" ,
                "instrName":      "Instructors name" ,
                "instrContact":   "Instructor contact information" ,
                "demoConsistant": "Syllabi are demonstrably consistent with comparable courses at other institutionsand embed the content and skill expectations of professional associations in field" , # not sure if this can be checked with keywords
                "assesMethod":    "Method of assessment: Indicate a measured way to determine student success and learning outcomes" ,
                "rubrics":        "Rubrics at course and project levels" , # may be missing
                "biblio":         "Bibliographic resources/ Other resourcesincluding audio-visual aids" ,
                "assignments":    "Assignments: Term papers, assignment synopses, examinations, etc." ,
                "taskCrit":       "Demonstrate that the course meets time on task criteria,college-level, rigor, and credit granted only to those meeting these objectives" ,
                "courseNum":      "Coursenumbermust be designated as L (liberal arts) or N (non-liberal arts)." ,
                "format":         "Classroom format (lecture, lab, discussion" ,
                "attenPol":       "Attendance policy" ,
                "reqRead":        "Semester required reading" ,
                "acadHonest":     "Statement on academic honesty" ,
                "teachAct":       "TEACH Act disclosure" ,
                "accommod":       "Accommodations & Assesibilty Statement" ,
                "diversity":      "Statement on diversity" , # not technically req
        }

missing = []

cmdIdex = 0

def checkFileAnal():
    print("checking file...")
    #print(keywords)
    now = datetime.datetime.now()

    o = open(logFile, "a")
    o.write("\n\n\n\nOutput for " + textFile + " on " + now.strftime("%Y-%m-%d %H:%M:%S")) #text file will be the sylibus being evaluated


    s = open(textFile, encoding="utf-8")


    matches = 0
    cmdIdex = 0

    for key in keywords: #loops through entire dictionary
        if key in checked:
            o.write("\n\nResults for " + key + ":")
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
                            o.write("\nMatch to \"" + i + "\" in line \"" + line[0 : -2] + "\": " + match)

                s.seek(0) #sets file pointer back to the begining
            except:
                print("ERROR LINE COULD NOT BE READ")

    print("file checked, " + str(matches) + " matches found")

    score = getScore()
    print("Score: " + score)

    return found


def checkFileFast():
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

def getScore():
    print("Score Calculateing")

    neededItems = 0
    foundItems = 0
    score = ""

    for key in keywords:
        if key in checked:
            neededItems += 1
            if(len(found[key]) != 0):
                foundItems += 1
            else:
                missing.append(keyToName[key])

    print("Missing elements:\n")
    print(missing)
    print()

    percent = foundItems / neededItems

    print("Total Items = " + str(neededItems))
    print("Found Items = " + str(foundItems))
    print("% found = " + str(percent))

    if(percent >= 1):
        score = "A+"
        return "A+"
    elif(percent >= .93):
        socre = "A"
        return "A"
    elif(percent >= .89):
        socre = "A-"
        return "A-"
    elif(percent >= .85):
        socre = "B+"
        return "B+"
    elif(percent >= .82):
        socre = "B"
        return "B"
    elif(percent >= .80):
        socre = "B-"
        return "B-"
    elif(percent >= .77):
        socre = "C+"
        return "C+"
    elif(percent >= .75):
        socre = "C"
        return "C"
    elif(percent >= .72):
        socre = "C-"
        return "C-"
    elif(percent >= .69):
        socre = "D+"
        return "D+"
    elif(percent >= .65):
        socre = "D"
        return "D"
    elif(percent >= .60):
        socre = "D-"
        return "D-"
    else:
        socre = "F"
        return "F"

checkFileAnal()
